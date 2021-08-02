export class Spoiler extends HTMLElement {
    private readonly text: Record<string, string>;
    private readonly events: Record<string, CustomEvent>;

    constructor() {
        super();
        this.text = {
            'when-close': 'Развернуть',
            'when-open': 'Свернуть'
        };

        this.events = {
            "close": new CustomEvent("app-spoiler.changed", {
                bubbles: true,
                detail: {opened: false},
            }),
            "open": new CustomEvent("app-spoiler.changed", {
                bubbles: true,
                detail: {opened: true},
            }),
        };

        this.innerHTML = `
      <button type="button">${this.text['when-close']}</button>
      <section style="display: none;">${this.innerHTML}</section>
    `;

        this.querySelector("button").addEventListener("click", () => {
            this.opened = !this.opened;
        });
    }

    get opened() {
        return this.getAttribute("opened") !== null;
    }

    set opened(state) {
        if (!!state) {
            this.setAttribute("opened", "");
        } else {
            this.removeAttribute("opened");
        }
    }

    attributeChangedCallback(attrName: string, oldVal: any, newVal: any) {
        switch (attrName) {
            case "opened":
                const opened = newVal !== null;
                const button = this.querySelector("button");
                const content = this.querySelector("section");
                const display = opened ? "block" : "none";
                const text = this.text[opened ? "when-open" : "when-close"];
                content.style.display = display;
                button.textContent = text;
                this.dispatchEvent(this.events[opened ? "open" : "close"]);
                break;

            case "text-when-open":
                this.text["when-open"] = newVal;
                if (this.opened) {
                    this.querySelector("button").textContent = newVal;
                }
                break;

            case "text-when-close":
                this.text["when-close"] = newVal;
                if (!this.opened) {
                    this.querySelector("button").textContent = newVal;
                }
                break;
        }
    }

    static get observedAttributes() {
        return [
            "opened",
            "text-when-open",
            "text-when-close",
        ];
    }
}
