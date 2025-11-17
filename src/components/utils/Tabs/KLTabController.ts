export default class KlTabController {
  private readonly delay: number

  private running: boolean
  private timeLeft: number
  private insideViewport: boolean
  public actualTabIndex: number
  public percentLeft: number

  private onTimeChangeCb: (percent: number) => void

  private tabsButton: NodeListOf<HTMLDivElement>
  private tabsContent: NodeListOf<HTMLDivElement>

  constructor(container: HTMLDivElement, delay: number) {
    this.delay = delay;
    this.timeLeft = delay
    this.actualTabIndex = 0;
    this.running = false;
    this.insideViewport = false;

    this.tabsButton = container.querySelectorAll(".kl-tabs_nav_buttons_button-container")
    this.tabsContent = container.querySelectorAll(".kl-tabs_content > *");

    this.onTimeChangeCb = () => {
    }
  }

  private runner() {
    requestAnimationFrame(() => {
      this.timeLeft--
      this.percentLeft = Math.floor((100 * this.timeLeft) / this.delay)
      this.updateComponent()
      if (this.timeLeft <= 0) {
        this.timeLeft = this.delay
        this.next()
      }
      if (this.running) {
        this.runner()
      }
    })
  }

  changeTab(index: number) {
    this.tabsContent.forEach((el: HTMLDivElement) => el.classList.remove("active"));
    this.tabsContent[index]?.classList.add("active");

    this.tabsButton.forEach((el: HTMLDivElement) => el.classList.remove("active"));
    this.tabsButton[index]?.classList.add("active");

    this.actualTabIndex = index;
  }

  next() {
    const nextIndex = this.actualTabIndex + 1
    this.changeTab(nextIndex >= this.tabsButton.length ? 0 : nextIndex)
  }

  run() {
    if(!this.insideViewport) return
    this.running = true
    this.runner()
  }

  stop() {
    this.running = false;
  }

  updateComponent() {
    this.onTimeChangeCb(this.percentLeft)
  }

  resetCounter(){
    this.timeLeft = this.delay
  }

  onTimeChange(cb: (percent: number) => void) {
    this.onTimeChangeCb = cb
  }

  inViewport(isInViewport: boolean){
    this.insideViewport = isInViewport
    if (isInViewport) {
      this.run()
    } else {
      this.stop()
    }
  }
}