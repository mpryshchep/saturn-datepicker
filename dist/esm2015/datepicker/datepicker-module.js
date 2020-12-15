/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { SatCalendar, SatCalendarHeader, SatCalendarFooter } from './calendar';
import { SatCalendarBody } from './calendar-body';
import { SatDatepicker, SatDatepickerContent, MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER, } from './datepicker';
import { SatDatepickerInput } from './datepicker-input';
import { SatDatepickerIntl } from './datepicker-intl';
import { SatDatepickerToggle, SatDatepickerToggleIcon } from './datepicker-toggle';
import { SatMonthView } from './month-view';
import { SatMultiYearView } from './multi-year-view';
import { SatYearView } from './year-view';
export class SatDatepickerModule {
}
SatDatepickerModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    MatButtonModule,
                    MatDialogModule,
                    OverlayModule,
                    A11yModule,
                    PortalModule,
                ],
                exports: [
                    SatCalendar,
                    SatCalendarBody,
                    SatDatepicker,
                    SatDatepickerContent,
                    SatDatepickerInput,
                    SatDatepickerToggle,
                    SatDatepickerToggleIcon,
                    SatMonthView,
                    SatYearView,
                    SatMultiYearView,
                    SatCalendarHeader,
                    SatCalendarFooter,
                ],
                declarations: [
                    SatCalendar,
                    SatCalendarBody,
                    SatDatepicker,
                    SatDatepickerContent,
                    SatDatepickerInput,
                    SatDatepickerToggle,
                    SatDatepickerToggleIcon,
                    SatMonthView,
                    SatYearView,
                    SatMultiYearView,
                    SatCalendarHeader,
                    SatCalendarFooter,
                ],
                providers: [
                    SatDatepickerIntl,
                    MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER,
                ],
                entryComponents: [
                    SatDatepickerContent,
                    SatCalendarHeader,
                    SatCalendarFooter,
                ]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zYXR1cm4tZGF0ZXBpY2tlci9zcmMvZGF0ZXBpY2tlci9kYXRlcGlja2VyLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDN0MsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNqRCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDekQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ3pELE9BQU8sRUFBQyxXQUFXLEVBQUUsaUJBQWlCLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDN0UsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ2hELE9BQU8sRUFDTCxhQUFhLEVBQ2Isb0JBQW9CLEVBQ3BCLCtDQUErQyxHQUNoRCxNQUFNLGNBQWMsQ0FBQztBQUN0QixPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUN0RCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNwRCxPQUFPLEVBQUMsbUJBQW1CLEVBQUUsdUJBQXVCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNqRixPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzFDLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFrRHhDLE1BQU0sT0FBTyxtQkFBbUI7OztZQS9DL0IsUUFBUSxTQUFDO2dCQUNSLE9BQU8sRUFBRTtvQkFDUCxZQUFZO29CQUNaLGVBQWU7b0JBQ2YsZUFBZTtvQkFDZixhQUFhO29CQUNiLFVBQVU7b0JBQ1YsWUFBWTtpQkFDYjtnQkFDRCxPQUFPLEVBQUU7b0JBQ1AsV0FBVztvQkFDWCxlQUFlO29CQUNmLGFBQWE7b0JBQ2Isb0JBQW9CO29CQUNwQixrQkFBa0I7b0JBQ2xCLG1CQUFtQjtvQkFDbkIsdUJBQXVCO29CQUN2QixZQUFZO29CQUNaLFdBQVc7b0JBQ1gsZ0JBQWdCO29CQUNoQixpQkFBaUI7b0JBQ2pCLGlCQUFpQjtpQkFDbEI7Z0JBQ0QsWUFBWSxFQUFFO29CQUNaLFdBQVc7b0JBQ1gsZUFBZTtvQkFDZixhQUFhO29CQUNiLG9CQUFvQjtvQkFDcEIsa0JBQWtCO29CQUNsQixtQkFBbUI7b0JBQ25CLHVCQUF1QjtvQkFDdkIsWUFBWTtvQkFDWixXQUFXO29CQUNYLGdCQUFnQjtvQkFDaEIsaUJBQWlCO29CQUNqQixpQkFBaUI7aUJBQ2xCO2dCQUNELFNBQVMsRUFBRTtvQkFDVCxpQkFBaUI7b0JBQ2pCLCtDQUErQztpQkFDaEQ7Z0JBQ0QsZUFBZSxFQUFFO29CQUNmLG9CQUFvQjtvQkFDcEIsaUJBQWlCO29CQUNqQixpQkFBaUI7aUJBQ2xCO2FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cclxuICpcclxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcclxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxyXG4gKi9cclxuXHJcbmltcG9ydCB7QTExeU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xyXG5pbXBvcnQge092ZXJsYXlNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcclxuaW1wb3J0IHtQb3J0YWxNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xyXG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7TWF0QnV0dG9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9idXR0b24nO1xyXG5pbXBvcnQge01hdERpYWxvZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZGlhbG9nJztcclxuaW1wb3J0IHtTYXRDYWxlbmRhciwgU2F0Q2FsZW5kYXJIZWFkZXIsIFNhdENhbGVuZGFyRm9vdGVyfSBmcm9tICcuL2NhbGVuZGFyJztcclxuaW1wb3J0IHtTYXRDYWxlbmRhckJvZHl9IGZyb20gJy4vY2FsZW5kYXItYm9keSc7XHJcbmltcG9ydCB7XHJcbiAgU2F0RGF0ZXBpY2tlcixcclxuICBTYXREYXRlcGlja2VyQ29udGVudCxcclxuICBNQVRfREFURVBJQ0tFUl9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWV9QUk9WSURFUixcclxufSBmcm9tICcuL2RhdGVwaWNrZXInO1xyXG5pbXBvcnQge1NhdERhdGVwaWNrZXJJbnB1dH0gZnJvbSAnLi9kYXRlcGlja2VyLWlucHV0JztcclxuaW1wb3J0IHtTYXREYXRlcGlja2VySW50bH0gZnJvbSAnLi9kYXRlcGlja2VyLWludGwnO1xyXG5pbXBvcnQge1NhdERhdGVwaWNrZXJUb2dnbGUsIFNhdERhdGVwaWNrZXJUb2dnbGVJY29ufSBmcm9tICcuL2RhdGVwaWNrZXItdG9nZ2xlJztcclxuaW1wb3J0IHtTYXRNb250aFZpZXd9IGZyb20gJy4vbW9udGgtdmlldyc7XHJcbmltcG9ydCB7U2F0TXVsdGlZZWFyVmlld30gZnJvbSAnLi9tdWx0aS15ZWFyLXZpZXcnO1xyXG5pbXBvcnQge1NhdFllYXJWaWV3fSBmcm9tICcuL3llYXItdmlldyc7XHJcblxyXG5cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbXHJcbiAgICBDb21tb25Nb2R1bGUsXHJcbiAgICBNYXRCdXR0b25Nb2R1bGUsXHJcbiAgICBNYXREaWFsb2dNb2R1bGUsXHJcbiAgICBPdmVybGF5TW9kdWxlLFxyXG4gICAgQTExeU1vZHVsZSxcclxuICAgIFBvcnRhbE1vZHVsZSxcclxuICBdLFxyXG4gIGV4cG9ydHM6IFtcclxuICAgIFNhdENhbGVuZGFyLFxyXG4gICAgU2F0Q2FsZW5kYXJCb2R5LFxyXG4gICAgU2F0RGF0ZXBpY2tlcixcclxuICAgIFNhdERhdGVwaWNrZXJDb250ZW50LFxyXG4gICAgU2F0RGF0ZXBpY2tlcklucHV0LFxyXG4gICAgU2F0RGF0ZXBpY2tlclRvZ2dsZSxcclxuICAgIFNhdERhdGVwaWNrZXJUb2dnbGVJY29uLFxyXG4gICAgU2F0TW9udGhWaWV3LFxyXG4gICAgU2F0WWVhclZpZXcsXHJcbiAgICBTYXRNdWx0aVllYXJWaWV3LFxyXG4gICAgU2F0Q2FsZW5kYXJIZWFkZXIsXHJcbiAgICBTYXRDYWxlbmRhckZvb3RlcixcclxuICBdLFxyXG4gIGRlY2xhcmF0aW9uczogW1xyXG4gICAgU2F0Q2FsZW5kYXIsXHJcbiAgICBTYXRDYWxlbmRhckJvZHksXHJcbiAgICBTYXREYXRlcGlja2VyLFxyXG4gICAgU2F0RGF0ZXBpY2tlckNvbnRlbnQsXHJcbiAgICBTYXREYXRlcGlja2VySW5wdXQsXHJcbiAgICBTYXREYXRlcGlja2VyVG9nZ2xlLFxyXG4gICAgU2F0RGF0ZXBpY2tlclRvZ2dsZUljb24sXHJcbiAgICBTYXRNb250aFZpZXcsXHJcbiAgICBTYXRZZWFyVmlldyxcclxuICAgIFNhdE11bHRpWWVhclZpZXcsXHJcbiAgICBTYXRDYWxlbmRhckhlYWRlcixcclxuICAgIFNhdENhbGVuZGFyRm9vdGVyLFxyXG4gIF0sXHJcbiAgcHJvdmlkZXJzOiBbXHJcbiAgICBTYXREYXRlcGlja2VySW50bCxcclxuICAgIE1BVF9EQVRFUElDS0VSX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZX1BST1ZJREVSLFxyXG4gIF0sXHJcbiAgZW50cnlDb21wb25lbnRzOiBbXHJcbiAgICBTYXREYXRlcGlja2VyQ29udGVudCxcclxuICAgIFNhdENhbGVuZGFySGVhZGVyLFxyXG4gICAgU2F0Q2FsZW5kYXJGb290ZXIsXHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgU2F0RGF0ZXBpY2tlck1vZHVsZSB7fVxyXG4iXX0=