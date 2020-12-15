/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation, NgZone, } from '@angular/core';
import { take } from 'rxjs/operators';
/**
 * An internal class that represents the data corresponding to a single calendar cell.
 * @docs-private
 */
export class SatCalendarCell {
    constructor(value, displayValue, ariaLabel, enabled, cssClasses) {
        this.value = value;
        this.displayValue = displayValue;
        this.ariaLabel = ariaLabel;
        this.enabled = enabled;
        this.cssClasses = cssClasses;
    }
}
/**
 * An internal component used to display calendar data in a table.
 * @docs-private
 */
export class SatCalendarBody {
    constructor(_elementRef, _ngZone) {
        this._elementRef = _elementRef;
        this._ngZone = _ngZone;
        /** Enables datepicker MouseOver effect on range mode */
        this.rangeHoverEffect = true;
        /** Whether to use date range selection behaviour.*/
        this.rangeMode = false;
        /** The number of columns in the table. */
        this.numCols = 7;
        /** The cell number of the active cell in the table. */
        this.activeCell = 0;
        /**
         * The aspect ratio (width / height) to use for the cells in the table. This aspect ratio will be
         * maintained even as the table resizes.
         */
        this.cellAspectRatio = 1;
        /** Emits when a new value is selected. */
        this.selectedValueChange = new EventEmitter();
    }
    _cellClicked(cell) {
        if (cell.enabled) {
            this.selectedValueChange.emit(cell.value);
        }
    }
    _mouseOverCell(cell) {
        if (this.rangeHoverEffect) {
            this._cellOver = cell.value;
        }
    }
    ngOnChanges(changes) {
        const columnChanges = changes['numCols'];
        const { rows, numCols } = this;
        if (changes['rows'] || columnChanges) {
            this._firstRowOffset = rows && rows.length && rows[0].length ? numCols - rows[0].length : 0;
        }
        if (changes['cellAspectRatio'] || columnChanges || !this._cellPadding) {
            this._cellPadding = `${50 * this.cellAspectRatio / numCols}%`;
        }
        if (columnChanges || !this._cellWidth) {
            this._cellWidth = `${100 / numCols}%`;
        }
        if (changes.activeCell) {
            // Only modify hovered cell variable when rangeHoverEffect is enabled
            if (this.rangeHoverEffect) {
                this._cellOver = this.activeCell + 1;
            }
        }
    }
    _isActiveCell(rowIndex, colIndex) {
        let cellNumber = rowIndex * this.numCols + colIndex;
        // Account for the fact that the first row may not have as many cells.
        if (rowIndex) {
            cellNumber -= this._firstRowOffset;
        }
        return cellNumber == this.activeCell;
    }
    /** Whenever to mark cell as semi-selected (inside dates interval). */
    _isSemiSelected(date) {
        if (!this.rangeMode) {
            return false;
        }
        if (this.rangeFull) {
            return true;
        }
        /** Do not mark start and end of interval. */
        if (date === this.begin || date === this.end) {
            return false;
        }
        if (this.begin && !this.end) {
            return date > this.begin;
        }
        if (this.end && !this.begin) {
            return date < this.end;
        }
        return date > this.begin && date < this.end;
    }
    /** Whenever to mark cell as semi-selected before the second date is selected (between the begin cell and the hovered cell). */
    _isBetweenOverAndBegin(date) {
        if (!this._cellOver || !this.rangeMode || !this.beginSelected) {
            return false;
        }
        if (this.isBeforeSelected && !this.begin) {
            return date > this._cellOver;
        }
        if (this._cellOver > this.begin) {
            return date > this.begin && date < this._cellOver;
        }
        if (this._cellOver < this.begin) {
            return date < this.begin && date > this._cellOver;
        }
        return false;
    }
    /** Whenever to mark cell as begin of the range. */
    _isBegin(date) {
        if (this.rangeMode && this.beginSelected && this._cellOver) {
            if (this.isBeforeSelected && !this.begin) {
                return this._cellOver === date;
            }
            else {
                return (this.begin === date && !(this._cellOver < this.begin)) ||
                    (this._cellOver === date && this._cellOver < this.begin);
            }
        }
        return this.begin === date;
    }
    /** Whenever to mark cell as end of the range. */
    _isEnd(date) {
        if (this.rangeMode && this.beginSelected && this._cellOver) {
            if (this.isBeforeSelected && !this.begin) {
                return false;
            }
            else {
                return (this.end === date && !(this._cellOver > this.begin)) ||
                    (this._cellOver === date && this._cellOver > this.begin);
            }
        }
        return this.end === date;
    }
    /** Focuses the active cell after the microtask queue is empty. */
    _focusActiveCell() {
        this._ngZone.runOutsideAngular(() => {
            this._ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
                const activeCell = this._elementRef.nativeElement.querySelector('.mat-calendar-body-active');
                if (activeCell) {
                    activeCell.focus();
                }
            });
        });
    }
    /** Whenever to highlight the target cell when selecting the second date in range mode */
    _previewCellOver(date) {
        return this._cellOver === date && this.rangeMode && this.beginSelected;
    }
}
SatCalendarBody.decorators = [
    { type: Component, args: [{
                selector: '[sat-calendar-body]',
                template: "<!--\r\n  If there's not enough space in the first row, create a separate label row. We mark this row as\r\n  aria-hidden because we don't want it to be read out as one of the weeks in the month.\r\n-->\r\n<tr *ngIf=\"_firstRowOffset < labelMinRequiredCells\" aria-hidden=\"true\">\r\n  <td class=\"mat-calendar-body-label\"\r\n      [attr.colspan]=\"numCols\"\r\n      [style.paddingTop]=\"_cellPadding\"\r\n      [style.paddingBottom]=\"_cellPadding\">\r\n    {{label}}\r\n  </td>\r\n</tr>\r\n\r\n<!-- Create the first row separately so we can include a special spacer cell. -->\r\n<tr *ngFor=\"let row of rows; let rowIndex = index\" role=\"row\">\r\n  <!--\r\n    We mark this cell as aria-hidden so it doesn't get read out as one of the days in the week.\r\n    The aspect ratio of the table cells is maintained by setting the top and bottom padding as a\r\n    percentage of the width (a variant of the trick described here:\r\n    https://www.w3schools.com/howto/howto_css_aspect_ratio.asp).\r\n  -->\r\n  <td *ngIf=\"rowIndex === 0 && _firstRowOffset\"\r\n      aria-hidden=\"true\"\r\n      class=\"mat-calendar-body-label\"\r\n      [attr.colspan]=\"_firstRowOffset\"\r\n      [style.paddingTop]=\"_cellPadding\"\r\n      [style.paddingBottom]=\"_cellPadding\">\r\n    {{_firstRowOffset >= labelMinRequiredCells ? label : ''}}\r\n  </td>\r\n  <td *ngFor=\"let item of row; let colIndex = index\"\r\n      role=\"gridcell\"\r\n      class=\"mat-calendar-body-cell\"\r\n      [ngClass]=\"item.cssClasses\"\r\n      [tabindex]=\"_isActiveCell(rowIndex, colIndex) ? 0 : -1\"\r\n      [class.mat-calendar-body-disabled]=\"!item.enabled\"\r\n      [class.mat-calendar-body-active]=\"_isActiveCell(rowIndex, colIndex)\"\r\n      [class.mat-calendar-body-begin-range]=\"_isBegin(item.value)\"\r\n      [class.mat-calendar-body-end-range]=\"_isEnd(item.value)\"\r\n      [class.mat-calendar-cell-semi-selected]=\"_isSemiSelected(item.value) || _isBetweenOverAndBegin(item.value)\"\r\n      [class.mat-calendar-cell-over]=\"_previewCellOver(item.value)\"\r\n      [attr.aria-label]=\"item.ariaLabel\"\r\n      [attr.aria-disabled]=\"!item.enabled || null\"\r\n      [attr.aria-selected]=\"selectedValue === item.value\"\r\n      (click)=\"_cellClicked(item)\"\r\n      (mouseover)=\"_mouseOverCell(item)\"\r\n      [style.width]=\"_cellWidth\"\r\n      [style.paddingTop]=\"_cellPadding\"\r\n      [style.paddingBottom]=\"_cellPadding\">\r\n    <div class=\"mat-calendar-body-cell-content\"\r\n         [class.mat-calendar-body-selected]=\"begin === item.value || end === item.value || selectedValue === item.value\"\r\n         [class.mat-calendar-body-semi-selected]=\"_isSemiSelected(item.value)\"\r\n         [class.mat-calendar-body-today]=\"todayValue === item.value\">\r\n      {{item.displayValue}}\r\n    </div>\r\n  </td>\r\n</tr>\r\n",
                host: {
                    'class': 'mat-calendar-body',
                    'role': 'grid',
                    'aria-readonly': 'true'
                },
                exportAs: 'matCalendarBody',
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".mat-calendar-body{min-width:224px}.mat-calendar-body-label{height:0;line-height:0;padding-left:4.71429%;padding-right:4.71429%;text-align:left}.mat-calendar-body-cell{cursor:pointer;height:0;line-height:0;outline:0;position:relative;text-align:center}.mat-calendar-body-disabled{cursor:default}.mat-calendar-body-cell-content{align-items:center;border-radius:999px;border-style:solid;border-width:1px;box-sizing:border-box;display:flex;height:90%;justify-content:center;left:5%;line-height:1;position:absolute;top:5%;width:90%}[dir=rtl] .mat-calendar-body-label{text-align:right}"]
            },] }
];
SatCalendarBody.ctorParameters = () => [
    { type: ElementRef },
    { type: NgZone }
];
SatCalendarBody.propDecorators = {
    label: [{ type: Input }],
    rangeHoverEffect: [{ type: Input }],
    rows: [{ type: Input }],
    todayValue: [{ type: Input }],
    selectedValue: [{ type: Input }],
    begin: [{ type: Input }],
    end: [{ type: Input }],
    beginSelected: [{ type: Input }],
    isBeforeSelected: [{ type: Input }],
    rangeFull: [{ type: Input }],
    rangeMode: [{ type: Input }],
    labelMinRequiredCells: [{ type: Input }],
    numCols: [{ type: Input }],
    activeCell: [{ type: Input }],
    cellAspectRatio: [{ type: Input }],
    selectedValueChange: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItYm9keS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NhdHVybi1kYXRlcGlja2VyL3NyYy9kYXRlcGlja2VyL2NhbGVuZGFyLWJvZHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixLQUFLLEVBQ0wsTUFBTSxFQUNOLGlCQUFpQixFQUNqQixNQUFNLEdBR1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBT3BDOzs7R0FHRztBQUNILE1BQU0sT0FBTyxlQUFlO0lBQzFCLFlBQW1CLEtBQWEsRUFDYixZQUFvQixFQUNwQixTQUFpQixFQUNqQixPQUFnQixFQUNoQixVQUFzQztRQUp0QyxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQ2IsaUJBQVksR0FBWixZQUFZLENBQVE7UUFDcEIsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUNqQixZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQ2hCLGVBQVUsR0FBVixVQUFVLENBQTRCO0lBQUcsQ0FBQztDQUM5RDtBQUdEOzs7R0FHRztBQWNILE1BQU0sT0FBTyxlQUFlO0lBb0UxQixZQUFvQixXQUFvQyxFQUFVLE9BQWU7UUFBN0QsZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQWhFakYsd0RBQXdEO1FBQy9DLHFCQUFnQixHQUFHLElBQUksQ0FBQztRQThCakMsb0RBQW9EO1FBQzNDLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFLM0IsMENBQTBDO1FBQ2pDLFlBQU8sR0FBRyxDQUFDLENBQUM7UUFFckIsdURBQXVEO1FBQzlDLGVBQVUsR0FBRyxDQUFDLENBQUM7UUFFeEI7OztXQUdHO1FBQ00sb0JBQWUsR0FBRyxDQUFDLENBQUM7UUFFN0IsMENBQTBDO1FBQ3ZC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Q0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQseUZBQXlGO0lBQ3pGLGdCQUFnQixDQUFDLElBQVk7UUFDM0IsT0FBTyxJQUFJLENBQUMsU0FBUyxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUM7SUFDekUsQ0FBQzs7O1lBbk5GLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUscUJBQXFCO2dCQUMvQix3eUZBQWlDO2dCQUVqQyxJQUFJLEVBQUU7b0JBQ0osT0FBTyxFQUFFLG1CQUFtQjtvQkFDNUIsTUFBTSxFQUFFLE1BQU07b0JBQ2QsZUFBZSxFQUFFLE1BQU07aUJBQ3hCO2dCQUNELFFBQVEsRUFBRSxpQkFBaUI7Z0JBQzNCLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs7YUFDaEQ7OztZQTdDQyxVQUFVO1lBS1YsTUFBTTs7O29CQTJDTCxLQUFLOytCQUdMLEtBQUs7bUJBR0wsS0FBSzt5QkFHTCxLQUFLOzRCQUdMLEtBQUs7b0JBS0wsS0FBSztrQkFLTCxLQUFLOzRCQUdMLEtBQUs7K0JBR0wsS0FBSzt3QkFHTCxLQUFLO3dCQUdMLEtBQUs7b0NBR0wsS0FBSztzQkFHTCxLQUFLO3lCQUdMLEtBQUs7OEJBTUwsS0FBSztrQ0FHTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXHJcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcclxuICovXHJcblxyXG5pbXBvcnQge1xyXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxyXG4gIENvbXBvbmVudCxcclxuICBFbGVtZW50UmVmLFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBJbnB1dCxcclxuICBPdXRwdXQsXHJcbiAgVmlld0VuY2Fwc3VsYXRpb24sXHJcbiAgTmdab25lLFxyXG4gIE9uQ2hhbmdlcyxcclxuICBTaW1wbGVDaGFuZ2VzLFxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge3Rha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuXHJcbi8qKlxyXG4gKiBFeHRyYSBDU1MgY2xhc3NlcyB0aGF0IGNhbiBiZSBhc3NvY2lhdGVkIHdpdGggYSBjYWxlbmRhciBjZWxsLlxyXG4gKi9cclxuZXhwb3J0IHR5cGUgU2F0Q2FsZW5kYXJDZWxsQ3NzQ2xhc3NlcyA9IHN0cmluZyB8IHN0cmluZ1tdIHwgU2V0PHN0cmluZz4gfCB7W2tleTogc3RyaW5nXTogYW55fTtcclxuXHJcbi8qKlxyXG4gKiBBbiBpbnRlcm5hbCBjbGFzcyB0aGF0IHJlcHJlc2VudHMgdGhlIGRhdGEgY29ycmVzcG9uZGluZyB0byBhIHNpbmdsZSBjYWxlbmRhciBjZWxsLlxyXG4gKiBAZG9jcy1wcml2YXRlXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgU2F0Q2FsZW5kYXJDZWxsIHtcclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgdmFsdWU6IG51bWJlcixcclxuICAgICAgICAgICAgICBwdWJsaWMgZGlzcGxheVZhbHVlOiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgcHVibGljIGFyaWFMYWJlbDogc3RyaW5nLFxyXG4gICAgICAgICAgICAgIHB1YmxpYyBlbmFibGVkOiBib29sZWFuLFxyXG4gICAgICAgICAgICAgIHB1YmxpYyBjc3NDbGFzc2VzPzogU2F0Q2FsZW5kYXJDZWxsQ3NzQ2xhc3Nlcykge31cclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBBbiBpbnRlcm5hbCBjb21wb25lbnQgdXNlZCB0byBkaXNwbGF5IGNhbGVuZGFyIGRhdGEgaW4gYSB0YWJsZS5cclxuICogQGRvY3MtcHJpdmF0ZVxyXG4gKi9cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdbc2F0LWNhbGVuZGFyLWJvZHldJyxcclxuICB0ZW1wbGF0ZVVybDogJ2NhbGVuZGFyLWJvZHkuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJ2NhbGVuZGFyLWJvZHkuY3NzJ10sXHJcbiAgaG9zdDoge1xyXG4gICAgJ2NsYXNzJzogJ21hdC1jYWxlbmRhci1ib2R5JyxcclxuICAgICdyb2xlJzogJ2dyaWQnLFxyXG4gICAgJ2FyaWEtcmVhZG9ubHknOiAndHJ1ZSdcclxuICB9LFxyXG4gIGV4cG9ydEFzOiAnbWF0Q2FsZW5kYXJCb2R5JyxcclxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgU2F0Q2FsZW5kYXJCb2R5IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcclxuICAvKiogVGhlIGxhYmVsIGZvciB0aGUgdGFibGUuIChlLmcuIFwiSmFuIDIwMTdcIikuICovXHJcbiAgQElucHV0KCkgbGFiZWw6IHN0cmluZztcclxuXHJcbiAgLyoqIEVuYWJsZXMgZGF0ZXBpY2tlciBNb3VzZU92ZXIgZWZmZWN0IG9uIHJhbmdlIG1vZGUgKi9cclxuICBASW5wdXQoKSByYW5nZUhvdmVyRWZmZWN0ID0gdHJ1ZTtcclxuXHJcbiAgLyoqIFRoZSBjZWxscyB0byBkaXNwbGF5IGluIHRoZSB0YWJsZS4gKi9cclxuICBASW5wdXQoKSByb3dzOiBTYXRDYWxlbmRhckNlbGxbXVtdO1xyXG5cclxuICAvKiogVGhlIHZhbHVlIGluIHRoZSB0YWJsZSB0aGF0IGNvcnJlc3BvbmRzIHRvIHRvZGF5LiAqL1xyXG4gIEBJbnB1dCgpIHRvZGF5VmFsdWU6IG51bWJlcjtcclxuXHJcbiAgLyoqIFRoZSB2YWx1ZSBpbiB0aGUgdGFibGUgdGhhdCBpcyBjdXJyZW50bHkgc2VsZWN0ZWQuICovXHJcbiAgQElucHV0KCkgc2VsZWN0ZWRWYWx1ZTogbnVtYmVyO1xyXG5cclxuICAvKiogVGhlIHZhbHVlIGluIHRoZSB0YWJsZSBzaW5jZSByYW5nZSBvZiBkYXRlcyBzdGFydGVkLlxyXG4gICAqIE51bGwgbWVhbnMgbm8gaW50ZXJ2YWwgb3IgaW50ZXJ2YWwgZG9lc24ndCBzdGFydCBpbiB0aGlzIG1vbnRoXHJcbiAgICovXHJcbiAgQElucHV0KCkgYmVnaW46IG51bWJlcnxudWxsO1xyXG5cclxuICAvKiogVGhlIHZhbHVlIGluIHRoZSB0YWJsZSByZXByZXNlbnRpbmcgZW5kIG9mIGRhdGVzIHJhbmdlLlxyXG4gICAqIE51bGwgbWVhbnMgbm8gaW50ZXJ2YWwgb3IgaW50ZXJ2YWwgZG9lc24ndCBlbmQgaW4gdGhpcyBtb250aFxyXG4gICAqL1xyXG4gIEBJbnB1dCgpIGVuZDogbnVtYmVyfG51bGw7XHJcblxyXG4gIC8qKiBXaGVuZXZlciB1c2VyIGFscmVhZHkgc2VsZWN0ZWQgc3RhcnQgb2YgZGF0ZXMgaW50ZXJ2YWwuICovXHJcbiAgQElucHV0KCkgYmVnaW5TZWxlY3RlZDogYm9vbGVhbjtcclxuXHJcbiAgLyoqIFdoZW5ldmVyIHRoZSBjdXJyZW50IG1vbnRoIGlzIGJlZm9yZSB0aGUgZGF0ZSBhbHJlYWR5IHNlbGVjdGVkICovXHJcbiAgQElucHV0KCkgaXNCZWZvcmVTZWxlY3RlZDogYm9vbGVhbjtcclxuXHJcbiAgLyoqIFdoZXRoZXIgdG8gbWFyayBhbGwgZGF0ZXMgYXMgc2VtaS1zZWxlY3RlZC4gKi9cclxuICBASW5wdXQoKSByYW5nZUZ1bGw6IGJvb2xlYW47XHJcblxyXG4gIC8qKiBXaGV0aGVyIHRvIHVzZSBkYXRlIHJhbmdlIHNlbGVjdGlvbiBiZWhhdmlvdXIuKi9cclxuICBASW5wdXQoKSByYW5nZU1vZGUgPSBmYWxzZTtcclxuXHJcbiAgLyoqIFRoZSBtaW5pbXVtIG51bWJlciBvZiBmcmVlIGNlbGxzIG5lZWRlZCB0byBmaXQgdGhlIGxhYmVsIGluIHRoZSBmaXJzdCByb3cuICovXHJcbiAgQElucHV0KCkgbGFiZWxNaW5SZXF1aXJlZENlbGxzOiBudW1iZXI7XHJcblxyXG4gIC8qKiBUaGUgbnVtYmVyIG9mIGNvbHVtbnMgaW4gdGhlIHRhYmxlLiAqL1xyXG4gIEBJbnB1dCgpIG51bUNvbHMgPSA3O1xyXG5cclxuICAvKiogVGhlIGNlbGwgbnVtYmVyIG9mIHRoZSBhY3RpdmUgY2VsbCBpbiB0aGUgdGFibGUuICovXHJcbiAgQElucHV0KCkgYWN0aXZlQ2VsbCA9IDA7XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSBhc3BlY3QgcmF0aW8gKHdpZHRoIC8gaGVpZ2h0KSB0byB1c2UgZm9yIHRoZSBjZWxscyBpbiB0aGUgdGFibGUuIFRoaXMgYXNwZWN0IHJhdGlvIHdpbGwgYmVcclxuICAgKiBtYWludGFpbmVkIGV2ZW4gYXMgdGhlIHRhYmxlIHJlc2l6ZXMuXHJcbiAgICovXHJcbiAgQElucHV0KCkgY2VsbEFzcGVjdFJhdGlvID0gMTtcclxuXHJcbiAgLyoqIEVtaXRzIHdoZW4gYSBuZXcgdmFsdWUgaXMgc2VsZWN0ZWQuICovXHJcbiAgQE91dHB1dCgpIHJlYWRvbmx5IHNlbGVjdGVkVmFsdWVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxudW1iZXI+ID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XHJcblxyXG4gIC8qKiBUaGUgbnVtYmVyIG9mIGJsYW5rIGNlbGxzIHRvIHB1dCBhdCB0aGUgYmVnaW5uaW5nIGZvciB0aGUgZmlyc3Qgcm93LiAqL1xyXG4gIF9maXJzdFJvd09mZnNldDogbnVtYmVyO1xyXG5cclxuICAvKiogUGFkZGluZyBmb3IgdGhlIGluZGl2aWR1YWwgZGF0ZSBjZWxscy4gKi9cclxuICBfY2VsbFBhZGRpbmc6IHN0cmluZztcclxuXHJcbiAgLyoqIFdpZHRoIG9mIGFuIGluZGl2aWR1YWwgY2VsbC4gKi9cclxuICBfY2VsbFdpZHRoOiBzdHJpbmc7XHJcblxyXG4gIC8qKiBUaGUgY2VsbCBudW1iZXIgb2YgdGhlIGhvdmVyZWQgY2VsbCAqL1xyXG4gIF9jZWxsT3ZlcjogbnVtYmVyO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PiwgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUpIHsgfVxyXG5cclxuICBfY2VsbENsaWNrZWQoY2VsbDogU2F0Q2FsZW5kYXJDZWxsKTogdm9pZCB7XHJcbiAgICBpZiAoY2VsbC5lbmFibGVkKSB7XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRWYWx1ZUNoYW5nZS5lbWl0KGNlbGwudmFsdWUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgX21vdXNlT3ZlckNlbGwoY2VsbDogU2F0Q2FsZW5kYXJDZWxsKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5yYW5nZUhvdmVyRWZmZWN0KSB7XHJcbiAgICAgIHRoaXMuX2NlbGxPdmVyID0gY2VsbC52YWx1ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcclxuICAgIGNvbnN0IGNvbHVtbkNoYW5nZXMgPSBjaGFuZ2VzWydudW1Db2xzJ107XHJcbiAgICBjb25zdCB7cm93cywgbnVtQ29sc30gPSB0aGlzO1xyXG5cclxuICAgIGlmIChjaGFuZ2VzWydyb3dzJ10gfHwgY29sdW1uQ2hhbmdlcykge1xyXG4gICAgICB0aGlzLl9maXJzdFJvd09mZnNldCA9IHJvd3MgJiYgcm93cy5sZW5ndGggJiYgcm93c1swXS5sZW5ndGggPyBudW1Db2xzIC0gcm93c1swXS5sZW5ndGggOiAwO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjaGFuZ2VzWydjZWxsQXNwZWN0UmF0aW8nXSB8fCBjb2x1bW5DaGFuZ2VzIHx8ICF0aGlzLl9jZWxsUGFkZGluZykge1xyXG4gICAgICB0aGlzLl9jZWxsUGFkZGluZyA9IGAkezUwICogdGhpcy5jZWxsQXNwZWN0UmF0aW8gLyBudW1Db2xzfSVgO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjb2x1bW5DaGFuZ2VzIHx8ICF0aGlzLl9jZWxsV2lkdGgpIHtcclxuICAgICAgdGhpcy5fY2VsbFdpZHRoID0gYCR7MTAwIC8gbnVtQ29sc30lYDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY2hhbmdlcy5hY3RpdmVDZWxsKSB7XHJcbiAgICAgIC8vIE9ubHkgbW9kaWZ5IGhvdmVyZWQgY2VsbCB2YXJpYWJsZSB3aGVuIHJhbmdlSG92ZXJFZmZlY3QgaXMgZW5hYmxlZFxyXG4gICAgICBpZiAodGhpcy5yYW5nZUhvdmVyRWZmZWN0KSB7XHJcbiAgICAgICAgdGhpcy5fY2VsbE92ZXIgPSB0aGlzLmFjdGl2ZUNlbGwgKyAxO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfaXNBY3RpdmVDZWxsKHJvd0luZGV4OiBudW1iZXIsIGNvbEluZGV4OiBudW1iZXIpOiBib29sZWFuIHtcclxuICAgIGxldCBjZWxsTnVtYmVyID0gcm93SW5kZXggKiB0aGlzLm51bUNvbHMgKyBjb2xJbmRleDtcclxuXHJcbiAgICAvLyBBY2NvdW50IGZvciB0aGUgZmFjdCB0aGF0IHRoZSBmaXJzdCByb3cgbWF5IG5vdCBoYXZlIGFzIG1hbnkgY2VsbHMuXHJcbiAgICBpZiAocm93SW5kZXgpIHtcclxuICAgICAgY2VsbE51bWJlciAtPSB0aGlzLl9maXJzdFJvd09mZnNldDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2VsbE51bWJlciA9PSB0aGlzLmFjdGl2ZUNlbGw7XHJcbiAgfVxyXG5cclxuICAvKiogV2hlbmV2ZXIgdG8gbWFyayBjZWxsIGFzIHNlbWktc2VsZWN0ZWQgKGluc2lkZSBkYXRlcyBpbnRlcnZhbCkuICovXHJcbiAgX2lzU2VtaVNlbGVjdGVkKGRhdGU6IG51bWJlcikge1xyXG4gICAgaWYgKCF0aGlzLnJhbmdlTW9kZSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5yYW5nZUZ1bGwpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICAvKiogRG8gbm90IG1hcmsgc3RhcnQgYW5kIGVuZCBvZiBpbnRlcnZhbC4gKi9cclxuICAgIGlmIChkYXRlID09PSB0aGlzLmJlZ2luIHx8IGRhdGUgPT09IHRoaXMuZW5kKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLmJlZ2luICYmICF0aGlzLmVuZCkge1xyXG4gICAgICByZXR1cm4gZGF0ZSA+IHRoaXMuYmVnaW47XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5lbmQgJiYgIXRoaXMuYmVnaW4pIHtcclxuICAgICAgcmV0dXJuIGRhdGUgPCB0aGlzLmVuZDtcclxuICAgIH1cclxuICAgIHJldHVybiBkYXRlID4gPG51bWJlcj50aGlzLmJlZ2luICYmIGRhdGUgPCA8bnVtYmVyPnRoaXMuZW5kO1xyXG4gIH1cclxuXHJcbiAgLyoqIFdoZW5ldmVyIHRvIG1hcmsgY2VsbCBhcyBzZW1pLXNlbGVjdGVkIGJlZm9yZSB0aGUgc2Vjb25kIGRhdGUgaXMgc2VsZWN0ZWQgKGJldHdlZW4gdGhlIGJlZ2luIGNlbGwgYW5kIHRoZSBob3ZlcmVkIGNlbGwpLiAqL1xyXG4gIF9pc0JldHdlZW5PdmVyQW5kQmVnaW4oZGF0ZTogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICBpZiAoIXRoaXMuX2NlbGxPdmVyIHx8ICF0aGlzLnJhbmdlTW9kZSB8fCAhdGhpcy5iZWdpblNlbGVjdGVkKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLmlzQmVmb3JlU2VsZWN0ZWQgJiYgIXRoaXMuYmVnaW4pIHtcclxuICAgICAgcmV0dXJuIGRhdGUgPiB0aGlzLl9jZWxsT3ZlcjtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLl9jZWxsT3ZlciA+IHRoaXMuYmVnaW4pIHtcclxuICAgICAgcmV0dXJuIGRhdGUgPiB0aGlzLmJlZ2luICYmIGRhdGUgPCB0aGlzLl9jZWxsT3ZlcjtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLl9jZWxsT3ZlciA8IHRoaXMuYmVnaW4pIHtcclxuICAgICAgcmV0dXJuIGRhdGUgPCB0aGlzLmJlZ2luICYmIGRhdGUgPiB0aGlzLl9jZWxsT3ZlcjtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIC8qKiBXaGVuZXZlciB0byBtYXJrIGNlbGwgYXMgYmVnaW4gb2YgdGhlIHJhbmdlLiAqL1xyXG4gIF9pc0JlZ2luKGRhdGU6IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgaWYgKHRoaXMucmFuZ2VNb2RlICYmIHRoaXMuYmVnaW5TZWxlY3RlZCAmJiB0aGlzLl9jZWxsT3Zlcikge1xyXG4gICAgICBpZiAodGhpcy5pc0JlZm9yZVNlbGVjdGVkICYmICF0aGlzLmJlZ2luKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NlbGxPdmVyID09PSBkYXRlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5iZWdpbiA9PT0gZGF0ZSAmJiAhKHRoaXMuX2NlbGxPdmVyIDwgdGhpcy5iZWdpbikpIHx8XHJcbiAgICAgICAgICAodGhpcy5fY2VsbE92ZXIgPT09IGRhdGUgJiYgdGhpcy5fY2VsbE92ZXIgPCB0aGlzLmJlZ2luKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5iZWdpbiA9PT0gZGF0ZTtcclxuICB9XHJcblxyXG4gIC8qKiBXaGVuZXZlciB0byBtYXJrIGNlbGwgYXMgZW5kIG9mIHRoZSByYW5nZS4gKi9cclxuICBfaXNFbmQoZGF0ZTogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICBpZiAodGhpcy5yYW5nZU1vZGUgJiYgdGhpcy5iZWdpblNlbGVjdGVkICYmIHRoaXMuX2NlbGxPdmVyKSB7XHJcbiAgICAgIGlmICh0aGlzLmlzQmVmb3JlU2VsZWN0ZWQgJiYgIXRoaXMuYmVnaW4pIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLmVuZCA9PT0gZGF0ZSAmJiAhKHRoaXMuX2NlbGxPdmVyID4gdGhpcy5iZWdpbikpIHx8XHJcbiAgICAgICAgICAodGhpcy5fY2VsbE92ZXIgPT09IGRhdGUgJiYgdGhpcy5fY2VsbE92ZXIgPiB0aGlzLmJlZ2luKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5lbmQgPT09IGRhdGU7XHJcbiAgfVxyXG5cclxuICAvKiogRm9jdXNlcyB0aGUgYWN0aXZlIGNlbGwgYWZ0ZXIgdGhlIG1pY3JvdGFzayBxdWV1ZSBpcyBlbXB0eS4gKi9cclxuICBfZm9jdXNBY3RpdmVDZWxsKCkge1xyXG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcclxuICAgICAgdGhpcy5fbmdab25lLm9uU3RhYmxlLmFzT2JzZXJ2YWJsZSgpLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICBjb25zdCBhY3RpdmVDZWxsOiBIVE1MRWxlbWVudCB8IG51bGwgPVxyXG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLm1hdC1jYWxlbmRhci1ib2R5LWFjdGl2ZScpO1xyXG5cclxuICAgICAgICBpZiAoYWN0aXZlQ2VsbCkge1xyXG4gICAgICAgICAgYWN0aXZlQ2VsbC5mb2N1cygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKiBXaGVuZXZlciB0byBoaWdobGlnaHQgdGhlIHRhcmdldCBjZWxsIHdoZW4gc2VsZWN0aW5nIHRoZSBzZWNvbmQgZGF0ZSBpbiByYW5nZSBtb2RlICovXHJcbiAgX3ByZXZpZXdDZWxsT3ZlcihkYXRlOiBudW1iZXIpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLl9jZWxsT3ZlciA9PT0gZGF0ZSAmJiB0aGlzLnJhbmdlTW9kZSAmJiB0aGlzLmJlZ2luU2VsZWN0ZWQ7XHJcbiAgfVxyXG59XHJcbiJdfQ==