const slider = document.querySelector('.container2');
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', e => {
  isDown = true;
  slider.classList.add('active');
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});
slider.addEventListener('mouseleave', () => {
  isDown = false;
});
slider.addEventListener('mouseup', () => {
  isDown = false;
});
slider.addEventListener('mousemove', e => {
  if(!isDown) return;
  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 1;
  slider.scrollLeft = scrollLeft - walk;
});

const slider2 = document.querySelector('.container3');
let isDown2 = false;
let startX2;
let scrollLeft2;

slider2.addEventListener('mousedown', e => {
  isDown = true;
  slider2.classList.add('active');
  startX = e.pageX - slider2.offsetLeft;
  scrollLeft = slider2.scrollLeft;
});
slider2.addEventListener('mouseleave', () => {
  isDown = false;
});
slider2.addEventListener('mouseup', () => {
  isDown = false;
});
slider2.addEventListener('mousemove', e => {
  if(!isDown) return;
  e.preventDefault();
  const x = e.pageX - slider2.offsetLeft;
  const walk = (x - startX) * 1;
  slider2.scrollLeft = scrollLeft - walk;
});

const slider3 = document.querySelector('.container4');
let isDown3 = false;
let startX3;
let scrollLeft3;

slider3.addEventListener('mousedown', e => {
  isDown = true;
  slider3.classList.add('active');
  startX = e.pageX - slider3.offsetLeft;
  scrollLeft = slider3.scrollLeft;
});
slider3.addEventListener('mouseleave', () => {
  isDown = false;
});
slider3.addEventListener('mouseup', () => {
  isDown = false;
});
slider3.addEventListener('mousemove', e => {
  if(!isDown) return;
  e.preventDefault();
  const x = e.pageX - slider3.offsetLeft;
  const walk = (x - startX) * 1;
  slider3.scrollLeft = scrollLeft - walk;
});

/* แกนy */
const slider4 = document.querySelector('.container5');
let isDown4 = false;
let startY4;
let scrollTop4;

slider4.addEventListener('mousedown', e => {
  isDown4 = true;
  slider4.classList.add('active');
  startY4 = e.pageY - slider4.offsetTop;
  scrollTop4 = slider4.scrollTop;
});

slider4.addEventListener('mouseleave', () => {
  isDown4 = false;
  slider4.classList.remove('active');
});

slider4.addEventListener('mouseup', () => {
  isDown4 = false;
  slider4.classList.remove('active');
});

slider4.addEventListener('mousemove', e => {
  if (!isDown4) return;
  e.preventDefault();
  const y = e.pageY - slider4.offsetTop;
  const walk = (y - startY4) * 1;
  slider4.scrollTop = scrollTop4 - walk;
});

const buttons = document.querySelectorAll('.season-btn');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    // ลบ active จากทุกปุ่มก่อน
    buttons.forEach(b => b.classList.remove('active'));
    // เพิ่ม active ให้ปุ่มที่ถูกกด
    btn.classList.add('active');
  });
});

