export const topButtonArea = document.querySelector('.top_btn_area');

const handleTopButton  = () => {
    if (document.documentElement.scrollTop > 400) {
        topButtonArea.style.display = 'block';
    } else {
        topButtonArea.style.display = 'none';
    }
};

window.addEventListener('scroll', handleTopButton);