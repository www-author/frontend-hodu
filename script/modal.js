import {topButtonArea} from "./scrollTop.js"
const body = document.body;
const modal = document.querySelector('#modal');
const emailForm = document.querySelector('.email_form');
const emailInput = document.getElementById('input_your_email');
const modalCloseButton = document.querySelector('.modal_close_btn');
const subscribeButton = document.querySelector('.subscribe_btn');
const topButton = document.querySelector('.top_btn');

const hide = () => {
    modal.style.display = 'none';
    emailInput.value = null;
    body.style.overflow = 'visible';
    topButtonArea.style.pointerEvents = 'auto';
    topButton.style.pointerEvents = 'auto';
};

const show = () => {
    modal.style.display = 'flex';
    body.style.overflow = 'hidden';
    topButtonArea.style.pointerEvents = 'none';
    topButton.style.pointerEvents = 'none';

}

window.onclick = (event) => {
    if(event.target === modal) hide();
}

emailForm.addEventListener('submit', (event) => event.preventDefault());
modalCloseButton.addEventListener('click', hide);
subscribeButton.addEventListener('click', (event) => {
    const validityState = emailInput.validity;
    if (validityState.typeMismatch || validityState.valueMissing){
        emailInput.reportValidity();
        hide();
    } else {
        show();
    }
});

window.addEventListener('keydown', event => {
    const keyCode = (event.key || "").toUpperCase();

    if (modal.style.display !== "none" && keyCode === 'ESCAPE') {
        hide();
    }

    if (event.target.parentNode.nodeName === "FORM" && keyCode === 'ENTER') {
        event.preventDefault();
    }
});





