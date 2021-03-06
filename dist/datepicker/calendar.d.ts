/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentType, Portal } from '@angular/cdk/portal';
import { AfterContentInit, AfterViewChecked, ChangeDetectorRef, EventEmitter, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { SatCalendarCellCssClasses } from './calendar-body';
import { SatDatepickerIntl } from './datepicker-intl';
import { SatMonthView } from './month-view';
import { SatMultiYearView } from './multi-year-view';
import { SatYearView } from './year-view';
import { SatDatepickerRangeValue } from './datepicker-input';
import { DateAdapter } from '../datetime/date-adapter';
import { MatDateFormats } from '../datetime/date-formats';
/**
 * Possible views for the calendar.
 * @docs-private
 */
export declare type SatCalendarView = 'month' | 'year' | 'multi-year';
/** Default header for SatCalendar */
export declare class SatCalendarHeader<D> {
    private _intl;
    calendar: SatCalendar<D>;
    private _dateAdapter;
    private _dateFormats;
    constructor(_intl: SatDatepickerIntl, calendar: SatCalendar<D>, _dateAdapter: DateAdapter<D>, _dateFormats: MatDateFormats, changeDetectorRef: ChangeDetectorRef);
    /** The label for the current calendar view. */
    get periodButtonText(): string;
    get periodButtonLabel(): string;
    /** The label for the previous button. */
    get prevButtonLabel(): string;
    /** The label for the next button. */
    get nextButtonLabel(): string;
    /** Handles user clicks on the period label.
     * Option`calendar.orderPeriodLabel` sort the label period views.
     * - Default [multi-year]: multi-year then back to month
     * - Month [month]: month > year > multi-year
     */
    currentPeriodClicked(): void;
    /** Handles user clicks on the previous button. */
    previousClicked(): void;
    /** Handles user clicks on the next button. */
    nextClicked(): void;
    /** Whether the previous period button is enabled. */
    previousEnabled(): boolean;
    /** Whether the next period button is enabled. */
    nextEnabled(): boolean;
    /** Whether the two dates represent the same view in the current view mode (month or year). */
    private _isSameView;
}
/** Default footer for SatCalendar */
export declare class SatCalendarFooter<D> {
}
/**
 * A calendar that is used as part of the datepicker.
 * @docs-private
 */
export declare class SatCalendar<D> implements AfterContentInit, AfterViewChecked, OnDestroy, OnChanges {
    private _dateAdapter;
    private _dateFormats;
    private _changeDetectorRef;
    /** Beginning of date range. */
    get beginDate(): D | null;
    set beginDate(value: D | null);
    private _beginDate;
    /** Date range end. */
    get endDate(): D | null;
    set endDate(value: D | null);
    private _endDate;
    /** Whenever datepicker is for selecting range of dates. */
    rangeMode: boolean;
    /** Enables datepicker MouseOver effect on range mode */
    rangeHoverEffect: boolean;
    /** Enables datepicker closing after selection */
    closeAfterSelection: boolean;
    /** Emits when new pair of dates selected. */
    dateRangesChange: EventEmitter<SatDatepickerRangeValue<D>>;
    /** Whenever user already selected start of dates interval. */
    beginDateSelected: D | boolean;
    /** Emits when a new start date has been selected in range mode. */
    beginDateSelectedChange: EventEmitter<D>;
    /** An input indicating the type of the header component, if set. */
    headerComponent: ComponentType<any>;
    /** A portal containing the header component type for this calendar. */
    _calendarHeaderPortal: Portal<any>;
    /** An input indicating the type of the footer component, if set. */
    footerComponent: ComponentType<any>;
    /** A portal containing the footer component type for this calendar. */
    _calendarFooterPortal: Portal<any>;
    private _intlChanges;
    /**
     * Used for scheduling that focus should be moved to the active cell on the next tick.
     * We need to schedule it, rather than do it immediately, because we have to wait
     * for Angular to re-evaluate the view children.
     */
    private _moveFocusOnNextTick;
    /** A date representing the period (month or year) to start the calendar in. */
    get startAt(): D | null;
    set startAt(value: D | null);
    private _startAt;
    /** Whether the calendar should be started in month or year view. */
    startView: SatCalendarView;
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
    /** Order the views when clicking on period label button */
    orderPeriodLabel: 'multi-year' | 'month';
    /** Emits when the currently selected date changes. */
    readonly selectedChange: EventEmitter<D>;
    /**
     * Emits the year chosen in multiyear view.
     * This doesn't imply a change on the selected date.
     */
    readonly yearSelected: EventEmitter<D>;
    /**
     * Emits the month chosen in year view.
     * This doesn't imply a change on the selected date.
     */
    readonly monthSelected: EventEmitter<D>;
    /** Emits when any date is selected. */
    readonly _userSelection: EventEmitter<void>;
    /** Reference to the current month view component. */
    monthView: SatMonthView<D>;
    /** Reference to the current year view component. */
    yearView: SatYearView<D>;
    /** Reference to the current multi-year view component. */
    multiYearView: SatMultiYearView<D>;
    /**
     * The current active date. This determines which time period is shown and which date is
     * highlighted when using keyboard navigation.
     */
    get activeDate(): D;
    set activeDate(value: D);
    private _clampedActiveDate;
    /** Whether the calendar is in month view. */
    get currentView(): SatCalendarView;
    set currentView(value: SatCalendarView);
    private _currentView;
    /**
     * Emits whenever there is a state change that the header may need to respond to.
     */
    stateChanges: Subject<void>;
    constructor(_intl: SatDatepickerIntl, _dateAdapter: DateAdapter<D>, _dateFormats: MatDateFormats, _changeDetectorRef: ChangeDetectorRef);
    ngAfterContentInit(): void;
    ngAfterViewChecked(): void;
    ngOnDestroy(): void;
    ngOnChanges(changes: SimpleChanges): void;
    focusActiveCell(): void;
    /** Updates today's date after an update of the active date */
    updateTodaysDate(): void;
    /** Handles date selection in the month view. */
    _dateSelected(date: D): void;
    /** Handles year selection in the multiyear view. */
    _yearSelectedInMultiYearView(normalizedYear: D): void;
    /** Handles month selection in the year view. */
    _monthSelectedInYearView(normalizedMonth: D): void;
    _userSelected(): void;
    /** Handles year/month selection in the multi-year/year views. */
    _goToDateInView(date: D, view: 'month' | 'year' | 'multi-year'): void;
    /**
     * @param obj The object to check.
     * @returns The given object if it is both a date instance and valid, otherwise null.
     */
    private _getValidDateOrNull;
    /** Returns the component instance that corresponds to the current calendar view. */
    private _getCurrentViewComponent;
    /** Reset inserted values */
    _reset(): void;
}
