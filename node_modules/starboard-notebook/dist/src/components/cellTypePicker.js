var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { getAvailableCellTypes, getCellTypeDefinitionForCellType } from "../cellTypes/registry";
function createDefaultCellCreationInterface(cellDefinition) {
    return (r, opts) => ({
        render() {
            return html `
        <div class="markdown-body w-100">
          <h2>${cellDefinition.name}</h2>
          <p>
            <small><code>${JSON.stringify(cellDefinition.cellType)}</code></small>
          </p>
        </div>
        <button @click=${opts.create} class="btn btn-primary btn-sm cta-button">
          Insert ${cellDefinition.name} cell
        </button>
      `;
        },
    });
}
let CellTypePicker = class CellTypePicker extends LitElement {
    constructor(runtime) {
        super();
        this.onInsert = () => {
            console.error("Could not insert cell as onInsert is not set on the cell type picker.");
        };
        this.runtime = runtime;
    }
    createRenderRoot() {
        return this;
    }
    connectedCallback() {
        super.connectedCallback();
        this.setHighlightedCellType("markdown");
        this.requestUpdate();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
    }
    setHighlightedCellType(highlightCellType) {
        if (this.currentCellCreationInterface && this.currentCellCreationInterface) {
            this.currentCellCreationInterface.dispose && this.currentCellCreationInterface.dispose();
        }
        this.currentHighlight = highlightCellType;
        const def = getCellTypeDefinitionForCellType(this.currentHighlight);
        const createCellCreationInterfaceFunction = def.createCellCreationInterface || createDefaultCellCreationInterface(def);
        this.currentCellCreationInterface = createCellCreationInterfaceFunction(this.runtime, {
            create: () => this.insertCell(),
        });
        this.requestUpdate();
        this.querySelector(".dropdown-item.active") && this.querySelector(".dropdown-item.active").focus();
    }
    onClickCellType(ct) {
        if (this.currentHighlight !== ct) {
            this.setHighlightedCellType(ct);
        }
        else {
            this.onInsert({ cellType: ct });
        }
    }
    insertCell() {
        if (this.currentCellCreationInterface.getCellInit) {
            this.onInsert(this.currentCellCreationInterface.getCellInit());
        }
        else {
            this.onInsert({ cellType: this.currentHighlight });
        }
    }
    render() {
        return html `
      <!-- <div data-popper-arrow></div> -->
      <starboard-ensure-parent-fits></starboard-ensure-parent-fits>
      <div class="inner">
        <nav class="sidebar">
          <h6 class="dropdown-header">Select Cell Type</h6>
          ${getAvailableCellTypes().map((ct) => {
            const ctString = typeof ct.cellType === "string" ? ct.cellType : ct.cellType[0];
            return html `
              <button
                @click=${() => this.onClickCellType(ctString)}
                title="${ctString}"
                class="dropdown-item ${ctString === this.currentHighlight ? " active" : ""}"
              >
                ${ct.name}
              </button>
            `;
        })}
        </nav>
        <div class="content">${this.currentCellCreationInterface.render()}</div>
      </div>
    `;
    }
};
__decorate([
    property({ type: Object })
], CellTypePicker.prototype, "onInsert", void 0);
CellTypePicker = __decorate([
    customElement("starboard-cell-type-picker")
], CellTypePicker);
export { CellTypePicker };
//# sourceMappingURL=cellTypePicker.js.map