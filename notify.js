import { add, addSocket } from 'event';
const timeouts = new Map();
const sounds = {};
const main_ = document.createElement('div');
const action = (e) => e.target.className === 'close' && close(e.target.parentElement.parentElement);
const wait = () => {
 for (const timeout of timeouts.values()) clearInterval(timeout);
};
const resume = () => {
 for (const alert of timeouts.keys()) timeouts.set(alert, setTimeout(close, 8000, alert));
};
add(document, 'NOTIFY', (e) => say(...e.detail), 'notice');
export default function (snds) {
 for (const [key, value] of Object.entries(snds)) {
  sounds[key] = new Audio(value);
  sounds[key].preload = 'auto';
 }
 main_.classList.add('notice-container');
 add(main_, 'click', action, 'notice');
 add(main_, 'mouseenter', wait, 'notice');
 add(main_, 'mouseleave', resume, 'notice');
 addSocket('ERROR', (e) => say('Eroare', 'error', e.msg), 'notice');
 addSocket('SUCCESS', (e) => say('Succes', 'success', e.msg), 'notice');
 addSocket('WARNING', (e) => say('Avertisment', 'warning', e.msg), 'notice');
 addSocket('NOTICE', (e) => say('Notificare', 'notice', e.msg), 'notice');
 document.body.appendChild(main_);
}

export function say(title, type = 'notice', body = '', subtitle = '', useru = '', data = '') {
 const alert = document.createElement('div');
 alert.className = 'notification ' + type;
 alert.innerHTML = `<div class='header'><span class="left">${title}</span><span>${subtitle}</span><span class='close'></span></div>
  <div class='msg'>${body}</div><div class='footer'><span class='left'>${useru}</span><span>${data}</span></div>`;
 main_.appendChild(alert);
 alert.scrollIntoView({ behavior: 'smooth' });
 if (type === 'notice' || type === 'success') timeouts.set(alert, setTimeout(close, 8000, alert));
 sounds[type]?.play();
 return alert;
}

export function close(alert) {
 if (timeouts.has(alert)) {
  clearTimeout(timeouts.get(alert));
  timeouts.delete(alert);
 }
 alert.remove();
}
