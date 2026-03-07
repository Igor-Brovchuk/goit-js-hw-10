import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const timerInput = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('button[data-start]');
const timerDays = document.querySelector('[data-days]');
const timerHours = document.querySelector('[data-hours]');
const timerMinutes = document.querySelector('[data-minutes]');
const timerSeconds = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let intervalId;
startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const nowDate = new Date();
    if (selectedDate <= nowDate) {
      iziToast.error({
        title: 'Error',
        titleColor: 'white',
        message: 'Please choose a date in the future',
        position: 'topRight',
        backgroundColor: 'red',
        messageColor: 'white',
      });

      startBtn.disabled = true;
      return;
    }
    userSelectedDate = selectedDate;
    startBtn.disabled = false;
  },
};

const fp = flatpickr(timerInput, options);

startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  timerInput.disabled = true;

  intervalId = setInterval(() => {
    const currentTime = Date.now();
    const diff = userSelectedDate - currentTime;

    if (diff <= 0) {
      clearInterval(intervalId);
      timerDays.textContent = '00';
      timerHours.textContent = '00';
      timerMinutes.textContent = '00';
      timerSeconds.textContent = '00';

      timerInput.disabled = false;
      return;
    }
    const { days, hours, minutes, seconds } = convertMs(diff);

    timerDays.textContent = addLeadingZero(days);
    timerHours.textContent = addLeadingZero(hours);
    timerMinutes.textContent = addLeadingZero(minutes);
    timerSeconds.textContent = addLeadingZero(seconds);
  }, 1000);
});

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
