# Google Calendar Appointment Scheduling Integration

## Overview

The Google Calendar appointment scheduling widget has been integrated into the Zero to One AI launch platform to allow clients to book strategy calls directly from the proposal interface.

## Implementation Details

### Updated Components

1. **CalendarBooking Component** (`components/proposal/CalendarBooking.tsx`)
   - Replaced simulated calendar with actual Google Calendar widget
   - Dynamically loads Google Calendar scheduling scripts
   - Provides clear booking instructions with step-by-step guidance
   - Includes proper cleanup when component unmounts

2. **Thank You Page** (`app/proposal/[proposalId]/thank-you/page.tsx`)
   - Added Google Calendar widget for scheduling kickoff meetings
   - Provides context about the booking process
   - Includes visual instructions for users

### Key Features

- **Dynamic Script Loading**: The Google Calendar scripts are loaded only when needed
- **Proper Cleanup**: Scripts are removed when components unmount to prevent memory leaks
- **User Guidance**: Clear instructions help users through the booking process
- **Email Collection**: The Google Calendar widget collects email addresses automatically
- **Calendar Invites**: Users receive calendar invitations immediately after booking

## Google Calendar Configuration

The integration uses the following Google Calendar appointment schedule:
- **URL**: `https://calendar.google.com/calendar/appointments/schedules/AcZssZ2D1BjhIsbIe41FjC29-jTg-YzHjDsWBj7a7dC_pJDZfBL6VgoYqZUx2IdpVfE3LLwzpYrLfU8K?gv=true`
- **Button Color**: `#039BE5` (Zero to One AI blue)
- **Button Label**: "Book your Launch Call"

## User Experience Flow

1. **From Proposal Page**:
   - User clicks "Book Call" button
   - Modal opens with call details and expectations
   - Google Calendar button loads
   - User clicks button to open Google's booking interface
   - User selects time slot and enters contact details
   - Confirmation shown and calendar invite sent

2. **From Thank You Page**:
   - After contract signing, booking widget is displayed
   - User can immediately schedule kickoff meeting
   - Same flow as above but embedded in the page

## Technical Implementation

### TypeScript Declaration
```typescript
declare global {
  interface Window {
    calendar?: {
      schedulingButton: {
        load: (config: {
          url: string;
          color: string;
          label: string;
          target: HTMLElement;
        }) => void;
      };
    };
  }
}
```

### Dynamic Loading Pattern
```typescript
useEffect(() => {
  if (isOpen && calendarContainerRef.current) {
    // Load styles
    const linkElement = document.createElement('link');
    linkElement.href = 'https://calendar.google.com/calendar/scheduling-button-script.css';
    linkElement.rel = 'stylesheet';
    document.head.appendChild(linkElement);

    // Create target container
    const targetDiv = document.createElement('div');
    calendarContainerRef.current.appendChild(targetDiv);

    // Load and initialize script
    const scriptElement = document.createElement('script');
    scriptElement.src = 'https://calendar.google.com/calendar/scheduling-button-script.js';
    scriptElement.async = true;
    
    scriptElement.onload = () => {
      if (window.calendar && window.calendar.schedulingButton) {
        window.calendar.schedulingButton.load({
          url: 'YOUR_CALENDAR_URL',
          color: '#039BE5',
          label: 'Book your Launch Call',
          target: targetDiv,
        });
      }
    };

    document.body.appendChild(scriptElement);
  }
}, [isOpen]);
```

## Benefits Over Previous Implementation

1. **Real Calendar Integration**: No more fake time slots - actual availability from Google Calendar
2. **Automatic Email Collection**: Google handles email verification and contact collection
3. **Immediate Calendar Invites**: Users get calendar invitations automatically
4. **Professional Experience**: Leverages Google's trusted booking interface
5. **No Manual Processing**: Eliminates need for manual appointment scheduling

## Troubleshooting

### Widget Not Loading
- Check browser console for script loading errors
- Verify Google Calendar URL is correct
- Ensure no ad blockers are interfering

### Styling Issues
- The Google Calendar button inherits some styles from the page
- Custom CSS may be needed for specific styling requirements
- Button color can be adjusted via the `color` parameter

### Calendar Access
- Ensure the Google Calendar is properly configured for public appointment scheduling
- Verify the calendar URL includes the `?gv=true` parameter
- Check that appointment types are properly configured in Google Calendar

## Future Enhancements

1. **Analytics Integration**: Track booking conversions
2. **Custom Styling**: Further customize the button appearance
3. **Multiple Calendar Options**: Support different appointment types
4. **Webhook Integration**: Get notified when appointments are booked
5. **CRM Integration**: Automatically create leads when appointments are scheduled 