const gridList = document.querySelector('.gallery_grid_wrap');
const showMoreButton = document.querySelector('.show_more_btn');
const stopMoreButton = document.querySelector('.stop_more_btn');
const downloadHeaderButton = document.querySelector('a[class="download_btn"]');
const downloadMainButton = document.querySelector('button[class="download_btn"]');

/*cat image url (query parameters)*/
const endpoint = 'https://api.thecatapi.com/v1/images/search';
const apiKey = '17d94b92-754f-46eb-99a0-65be65b5d18f';
const contentType = 'application/json';
let limit = 6;
let page = 1;

/* cat image api headers */
const header = new Headers();
header.append('Content-Type', contentType);
header.append('x-api-key', apiKey);

const requestOptions = {
    method: 'GET',
    headers: header,
    redirect: 'follow'
};

let isBlock = false;

const getCatImages = async (page, limit, mime_type) => {
    try {
        const response = await fetch(`${endpoint}?limit=${limit}&page=${page}&mime_types=${mime_type}`, requestOptions);
        if (!response.ok) {
            throw new Error('네트워크 응답에 실패하였습니다.');
        }
        return response;
    } catch (e) {
        console.error('데이터 취득에 실패하였습니다.', e);
    }
};

const createImageElements = (jsonArray) => {
    const cssText = `width: 378px;
        height:378px;
        border-radius: 30px;
        box-shadow: 30px 30px 40px 0px #FAE5D3;
    `;

    jsonArray.forEach(jsonObject => {
        gridList.insertAdjacentHTML('beforeend', `<li><img src='${jsonObject.url}' alt='고양이' role='img' style="${cssText}"></li>`);
    });
};

const renderCatImage = async (mineType) => {
    const response = await getCatImages(page, limit, mineType);
    const jsonArray = await response.json();
    await createImageElements(jsonArray);

    if (page >= 2) {
        gridList.style.cssText = `height: 828px;
            overflow-y: scroll;
        `;
        const hideElements = gridList.parentElement.querySelectorAll('[class^="show_more_"]');
        hideElements.forEach(element => {
            element.style.display = 'none';
        });

        stopMoreButton.style.cssText = `display: block;
            margin-top : 30px;
        `;

        limit = 15;
        intersectionObserver();
    }
};


const getFileName = (fileType) => {
    let date = new Date();
    let dateOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    let nowDate= new Intl
        .DateTimeFormat('ko-KR', dateOptions)
        .format(date)
        .replace(/[. ]|[: ]/g, '');

    return `${nowDate}.${fileType}`;
};

const createFile = (data, fileName) => {
    debugger;

    const url = window.URL.createObjectURL(data);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = getFileName(fileName);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(url);
};

const createFileFromJson = (data, fileName) => {
    const anchor = document.createElement('a');
    anchor.href = data?.url;
    anchor.download = fileName;
    anchor.click();
    anchor.remove();
};

const downloadFile = (data, fileType) => {
    try {
        createFile(data, getFileName(fileType));
    } catch (e) {
        console.error('파일 다운로드에 실패하였습니다.', e);
    }
};

const downloadImageFile = async (fileType) => {
    const response = await getCatImages(0, 1, fileType);
    const blob = await response.blob();
    await downloadFile(blob, fileType);
};

// 최초 이미지 렌더링
renderCatImage('gif').then(() => page++);

const intersectionObserver = () => {
    let options = {
        root: document.querySelector('#gallery'),
        rootMargin: '0px',
        threshold: 1.0
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting || isBlock)
                return;

            renderCatImage('gif').then(() => page++);
        });
    }, options);

    if (isBlock) {
        observer.disconnect();
        isBlock = false;
        return;
    }
    observer.observe(gridList);
};


const stopInfinityScroll = () => {
    isBlock = true;
    stopMoreButton.style.display = 'none';
    intersectionObserver();

    const showElements = gridList.parentElement.querySelectorAll('[class^="show_more_"]');
    showElements.forEach(element => {
        element.style.display = 'block';
    });
}

showMoreButton.addEventListener('click', intersectionObserver);
stopMoreButton.addEventListener('click', stopInfinityScroll);
downloadHeaderButton.addEventListener('click', () => downloadImageFile('jpg'));
downloadMainButton.addEventListener('click', () => downloadImageFile('jpg'));
