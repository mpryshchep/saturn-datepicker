/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AfterContentInit, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { DateAdapter } from '../datetime/date-adapter';
import { MatDateFormats } from '../datetime/date-formats';
import { Directionality } from '@angular/cdk/bidi';
import { SatCalendarBody, SatCalendarCell, SatCalendarCellCssClasses } from './calendar-body';
/**
 * An internal component used to display a single month in the datepicker.
 * @docs-private
 */
export declare class SatMonthView<D> implements AfterContentInit {
    private _changeDetectorRef;
    private _dateFormats;
    _dateAdapter: DateAdapter<D>;
    private _dir?;
    /** Current start of interval. */
    get beginDate(): D | null;
    set beginDate(value: D | null);
    private _beginDate;
    /** Current end of interval. */
    get endDate(): D | null;
    set endDate(value: D | null);
    private _endDate;
    /** Allow selecting range of dates. */
    rangeMode: boolean;
    /** Enables datepicker MouseOver effect on range mode */
    rangeHoverEffect: boolean;
    /** Enables datepicker closing after selection */
    closeAfterSelection: boolean;
    /** First day of interval. */
    _beginDateNumber: number | null;
    _endDateNumber: number | null;
    /** Whenever full month is inside dates interval. */
    _rangeFull: boolean | null;
    /** Whenever user already selected start of dates interval. */
    set beginDateSelected(value: D | null);
    /** Whenever user already selected start of dates interval. An inner property that avoid asynchronous problems */
    _beginDateSelected: D | null;
    /**
     * The date to display in this month view (everything other than the month and year is ignored).
     */
    get activeDate(): D;
    set activeDate(value: D);
    private _activeDate;
    /** The currently selected date. */
    get selected(): D | null;
    set selected(value: D | null);
    private _selected;
    /** The minimum selectable date. */
    get minDate(): D | null;
    set minDate(value: D | null);
    private _minDate;
    /** The maximum selectable date. */
    get maxDate(): D | null;
    set maxDate(value: D | null);
    private _maxDate;
    /** Function used to filter which dates are selectable. */
    dateFilter: (date: D) => boolean;
    /** Function that can be used to add custom CSS classes to dates. */
    dateClass: (date: D) => SatCalendarCellCssClasses;
    /** Emits when a new date is selected. */
    readonly selectedChange: EventEmitter<D | null>;
    /** Emits when any date is selected. */
    readonly _userSelection: EventEmitter<void>;
    /** Emits when any date is activated. */
    readonly activeDateChange: EventEmitter<D>;
    /** The body of calendar table */
    _matCalendarBody: SatCalendarBody;
    /** The label for this month (e.g. "January 2017"). */
    _monthLabel: string;
    /** Grid of calendar cells representing the dates of the month. */
    _weeks: SatCalendarCell[][];
    /** The number of blank cells in the first row before the 1st of the month. */
    _firstWeekOffset: number;
    /**
     * The date of the month that the currently selected Date falls on.
     * Null if the currently selected Date is in another month.
     */
    _selectedDate: number | null;
    /** The date of the month that today falls on. Null if today is in another month. */
    _todayDate: number | null;
    /** The names of the weekdays. */
    _weekdays: {
        long: string;
        narrow: string;
    }[];
    constructor(_changeDetectorRef: ChangeDetectorRef, _dateFormats: MatDateFormats, _dateAdapter: DateAdapter<D>, _dir?: Directionality);
    ngAfterContentInit(): void;
    /** Handles when a new date is selected. */
    _dateSelected(date: number): void;
    /** Handles keydown events on the calendar body when calendar is in month view. */
    _handleCalendarBodyKeydown(event: KeyboardEvent): void;
    /** Initializes this month view. */
    _init(): void;
    /** Focuses the active cell after the microtask queue is empty. */
    _focusActiveCell(): void;
    /** Initializes the weekdays. */
    private _initWeekdays;
    /** Creates SatCalendarCells for the dates in this month. */
    private _createWeekCells;
    /** Date filter for the month */
    private _shouldEnableDate;
    /**
     * Gets the date in this month that the given Date falls on.
     * Returns null if the given Date is in another month.
     */
    private _getDateInCurrentMonth;
    /** Checks whether the 2 dates are non-null and fall within the same month of the same year. */
    private _hasSameMonthAndYear;
    /**
     * @param obj The object to check.
     * @returns The given object if it is both a date instance and valid, otherwise null.
     */
    private _getValidDateOrNull;
    /** Determines whether the user has the RTL layout direction. */
    private _isRtl;
    /** Updates range full parameter on each begin or end of interval update.
     * Necessary to display calendar-body correctly
     */
    private updateRangeSpecificValues;
}
