class CountdownTimer {
  constructor(deadline, cbChange, cbComplete) {
    this._deadline = deadline;
    this._cbChange = cbChange;
    this._cbComplete = cbComplete;
    this._timerId = null;
    this._out = {
      minutes: "",
      seconds: "",
      minutesTitle: "",
      secondsTitle: "",
    };
    this._start();
  }
  static declensionNum(num, words) {
    return words[
      num % 100 > 4 && num % 100 < 20
        ? 2
        : [2, 0, 1, 1, 1, 2][num % 10 < 5 ? num % 10 : 5]
    ];
  }
  _start() {
    this._calc();
    this._timerId = setInterval(this._calc.bind(this), 1000);
  }
  _calc() {
    const diff = this._deadline - new Date();
    const minutes = diff > 0 ? Math.floor(diff / 1000 / 60) % 60 : 0;
    const seconds = diff > 0 ? Math.floor(diff / 1000) % 60 : 0;
    this._out.minutes = minutes < 10 ? "0" + minutes : minutes;
    this._out.seconds = seconds < 10 ? "0" + seconds : seconds;
    this._out.minutesTitle = CountdownTimer.declensionNum(minutes, [
      "минута",
      "минуты",
      "минут",
    ]);
    this._out.secondsTitle = CountdownTimer.declensionNum(seconds, [
      "секунда",
      "секунды",
      "секунд",
    ]);
    this._cbChange ? this._cbChange(this._out) : null;
    if (diff <= 0) {
      clearInterval(this._timerId);
      this._cbComplete ? this._cbComplete() : null;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const elMinutes = document.querySelector(".orderForm__timer .timer__minutes");
  const elSeconds = document.querySelector(".orderForm__timer .timer__seconds");

  (function timer() {
    const deadline = new Date(Date.now() + (30 * 60 * 1000 + 999));
    new CountdownTimer(
      deadline,
      (timer) => {
        elMinutes.textContent = timer.minutes;
        elSeconds.textContent = timer.seconds;
        elMinutes.dataset.title = timer.minutesTitle;
        elSeconds.dataset.title = timer.secondsTitle;
      },
      () => {
        timer();
      }
    );
  })();
});
