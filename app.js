class CalendarApp {
    constructor() {
        this.currentDate = new Date();
        this.currentMonth = this.currentDate.getMonth();
        this.currentYear = this.currentDate.getFullYear();
        this.events = [];
        this.eventIdCounter = 3; // Starting from 3 since we have 2 sample events
        this.editingEventId = null;

        // Event colors for selection
        this.eventColors = [
            "#1976d2", "#388e3c", "#f57c00", "#d32f2f", 
            "#7b1fa2", "#0288d1", "#5d4037"
        ];

        this.monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        this.initializeEvents();
        this.initializeEventListeners();
        this.renderCalendar();
    }

    initializeEvents() {
        // Add sample events
        const sampleEvents = [
            {
                id: 1,
                title: "Team Meeting",
                date: "2025-08-15",
                startTime: "10:00",
                endTime: "11:00",
                description: "Weekly team standup meeting",
                color: "#1976d2"
            },
            {
                id: 2,
                title: "Doctor Appointment",
                date: "2025-08-20",
                startTime: "14:30",
                endTime: "15:30",
                description: "Annual checkup",
                color: "#388e3c"
            }
        ];

        this.events = [...sampleEvents];
    }

    initializeEventListeners() {
        // Wait for DOM to be ready before adding listeners
        const addListeners = () => {
            // Navigation buttons
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const todayBtn = document.getElementById('todayBtn');
            const createEventBtn = document.getElementById('createEventBtn');

            if (prevBtn) prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateMonth(-1);
            });
            
            if (nextBtn) nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateMonth(1);
            });
            
            if (todayBtn) todayBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToToday();
            });

            if (createEventBtn) createEventBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openCreateModal();
            });

            // Modal controls
            const modalClose = document.getElementById('modalClose');
            const modalOverlay = document.getElementById('modalOverlay');
            const cancelBtn = document.getElementById('cancelBtn');
            const eventForm = document.getElementById('eventForm');
            const deleteBtn = document.getElementById('deleteBtn');

            if (modalClose) modalClose.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
            });
            
            if (modalOverlay) modalOverlay.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
            });
            
            if (cancelBtn) cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
            });

            // Form submission
            if (eventForm) eventForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
            
            if (deleteBtn) deleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.deleteEvent();
            });

            // Keyboard navigation
            document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', addListeners);
        } else {
            addListeners();
        }
    }

    navigateMonth(direction) {
        console.log('Navigating month:', direction);
        this.currentMonth += direction;
        
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        } else if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        
        this.renderCalendar();
    }

    goToToday() {
        console.log('Going to today');
        const today = new Date();
        this.currentMonth = today.getMonth();
        this.currentYear = today.getFullYear();
        this.renderCalendar();
    }

    renderCalendar() {
        this.updateMonthYearDisplay();
        this.renderCalendarDates();
    }

    updateMonthYearDisplay() {
        const monthYearDisplay = document.getElementById('monthYearDisplay');
        if (monthYearDisplay) {
            monthYearDisplay.textContent = `${this.monthNames[this.currentMonth]} ${this.currentYear}`;
        }
    }

    renderCalendarDates() {
        const calendarDates = document.getElementById('calendarDates');
        if (!calendarDates) return;
        
        calendarDates.innerHTML = '';

        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const firstDayWeekday = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        // Calculate previous month days to show
        const prevMonth = this.currentMonth === 0 ? 11 : this.currentMonth - 1;
        const prevYear = this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear;
        const prevMonthLastDay = new Date(prevYear, prevMonth + 1, 0).getDate();

        // Show 6 weeks (42 days total)
        for (let i = 0; i < 42; i++) {
            const dateCell = document.createElement('div');
            dateCell.className = 'date-cell';
            dateCell.setAttribute('tabindex', '0');

            let dayNumber, cellDate, isCurrentMonth = true, isOtherMonth = false;

            if (i < firstDayWeekday) {
                // Previous month days
                dayNumber = prevMonthLastDay - firstDayWeekday + i + 1;
                cellDate = new Date(prevYear, prevMonth, dayNumber);
                isCurrentMonth = false;
                isOtherMonth = true;
                dateCell.classList.add('other-month');
            } else if (i >= firstDayWeekday + daysInMonth) {
                // Next month days
                dayNumber = i - firstDayWeekday - daysInMonth + 1;
                const nextMonth = this.currentMonth === 11 ? 0 : this.currentMonth + 1;
                const nextYear = this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear;
                cellDate = new Date(nextYear, nextMonth, dayNumber);
                isCurrentMonth = false;
                isOtherMonth = true;
                dateCell.classList.add('other-month');
            } else {
                // Current month days
                dayNumber = i - firstDayWeekday + 1;
                cellDate = new Date(this.currentYear, this.currentMonth, dayNumber);
            }

            // Add weekend styling
            const dayOfWeek = cellDate.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                dateCell.classList.add('weekend');
            }

            // Check if this is today
            const today = new Date();
            if (this.isSameDate(cellDate, today)) {
                dateCell.classList.add('today');
            }

            // Create date number element
            const dateNumber = document.createElement('div');
            dateNumber.className = 'date-number';
            dateNumber.textContent = dayNumber;
            dateCell.appendChild(dateNumber);

            // Create events container
            const eventsContainer = document.createElement('div');
            eventsContainer.className = 'events-container';
            dateCell.appendChild(eventsContainer);

            // Add events for this date
            this.renderEventsForDate(cellDate, eventsContainer);

            // Add click listener for date cell
            const dateString = this.formatDate(cellDate);
            dateCell.addEventListener('click', (e) => {
                console.log('Date cell clicked:', dateString);
                if (e.target.classList.contains('event')) {
                    return; // Event click will be handled separately
                }
                this.openCreateModal(dateString);
            });

            // Add keyboard support
            dateCell.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.openCreateModal(dateString);
                }
            });

            calendarDates.appendChild(dateCell);
        }
    }

    renderEventsForDate(date, container) {
        const dateString = this.formatDate(date);
        const dayEvents = this.events.filter(event => event.date === dateString);

        dayEvents.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = 'event';
            eventElement.style.backgroundColor = event.color;
            eventElement.textContent = event.title;
            eventElement.setAttribute('tabindex', '0');

            eventElement.addEventListener('click', (e) => {
                console.log('Event clicked:', event.title);
                e.stopPropagation();
                this.openEditModal(event);
            });

            eventElement.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    this.openEditModal(event);
                }
            });

            container.appendChild(eventElement);
        });
    }

    openCreateModal(selectedDate = null) {
        console.log('Opening create modal for date:', selectedDate);
        const modal = document.getElementById('eventModal');
        const modalTitle = document.getElementById('modalTitle');
        const deleteBtn = document.getElementById('deleteBtn');

        if (!modal || !modalTitle || !deleteBtn) return;

        modalTitle.textContent = 'Create Event';
        deleteBtn.classList.add('hidden');
        this.editingEventId = null;

        // Reset form
        this.resetForm();

        // Set selected date if provided
        if (selectedDate) {
            const dateInput = document.getElementById('eventDate');
            if (dateInput) dateInput.value = selectedDate;
        } else {
            const dateInput = document.getElementById('eventDate');
            if (dateInput) dateInput.value = this.formatDate(new Date());
        }

        // Set default times
        const now = new Date();
        const startTime = `${String(now.getHours()).padStart(2, '0')}:00`;
        const endTime = `${String(now.getHours() + 1).padStart(2, '0')}:00`;
        
        const startTimeInput = document.getElementById('eventStartTime');
        const endTimeInput = document.getElementById('eventEndTime');
        
        if (startTimeInput) startTimeInput.value = startTime;
        if (endTimeInput) endTimeInput.value = endTime;

        modal.classList.remove('hidden');
        
        const titleInput = document.getElementById('eventTitle');
        if (titleInput) {
            setTimeout(() => titleInput.focus(), 100);
        }
    }

    openEditModal(event) {
        console.log('Opening edit modal for event:', event);
        const modal = document.getElementById('eventModal');
        const modalTitle = document.getElementById('modalTitle');
        const deleteBtn = document.getElementById('deleteBtn');

        if (!modal || !modalTitle || !deleteBtn) return;

        modalTitle.textContent = 'Edit Event';
        deleteBtn.classList.remove('hidden');
        this.editingEventId = event.id;

        // Populate form with event data
        const titleInput = document.getElementById('eventTitle');
        const dateInput = document.getElementById('eventDate');
        const startTimeInput = document.getElementById('eventStartTime');
        const endTimeInput = document.getElementById('eventEndTime');
        const descriptionInput = document.getElementById('eventDescription');
        const colorInput = document.getElementById('eventColor');

        if (titleInput) titleInput.value = event.title;
        if (dateInput) dateInput.value = event.date;
        if (startTimeInput) startTimeInput.value = event.startTime;
        if (endTimeInput) endTimeInput.value = event.endTime;
        if (descriptionInput) descriptionInput.value = event.description || '';
        if (colorInput) colorInput.value = event.color;

        modal.classList.remove('hidden');
        
        if (titleInput) {
            setTimeout(() => titleInput.focus(), 100);
        }
    }

    closeModal() {
        const modal = document.getElementById('eventModal');
        if (modal) {
            modal.classList.add('hidden');
        }
        this.editingEventId = null;
        this.resetForm();
    }

    resetForm() {
        const eventForm = document.getElementById('eventForm');
        const colorInput = document.getElementById('eventColor');
        
        if (eventForm) eventForm.reset();
        if (colorInput) colorInput.value = this.eventColors[0];
    }

    handleFormSubmit(e) {
        e.preventDefault();
        console.log('Form submitted');
        
        const titleInput = document.getElementById('eventTitle');
        const dateInput = document.getElementById('eventDate');
        const startTimeInput = document.getElementById('eventStartTime');
        const endTimeInput = document.getElementById('eventEndTime');
        const descriptionInput = document.getElementById('eventDescription');
        const colorInput = document.getElementById('eventColor');

        const title = titleInput ? titleInput.value.trim() : '';
        const date = dateInput ? dateInput.value : '';
        const startTime = startTimeInput ? startTimeInput.value : '';
        const endTime = endTimeInput ? endTimeInput.value : '';
        const description = descriptionInput ? descriptionInput.value.trim() : '';
        const color = colorInput ? colorInput.value : this.eventColors[0];

        if (!title || !date || !startTime || !endTime) {
            alert('Please fill in all required fields.');
            return;
        }

        // Validate time order
        if (startTime >= endTime) {
            alert('End time must be after start time.');
            return;
        }

        const eventData = {
            title,
            date,
            startTime,
            endTime,
            description,
            color
        };

        console.log('Saving event:', eventData);

        if (this.editingEventId) {
            this.updateEvent(this.editingEventId, eventData);
        } else {
            this.createEvent(eventData);
        }

        this.closeModal();
        this.renderCalendar();
    }

    createEvent(eventData) {
        const newEvent = {
            id: this.eventIdCounter++,
            ...eventData
        };
        this.events.push(newEvent);
        console.log('Event created:', newEvent);
        console.log('All events:', this.events);
    }

    updateEvent(eventId, eventData) {
        const eventIndex = this.events.findIndex(event => event.id === eventId);
        if (eventIndex !== -1) {
            this.events[eventIndex] = { id: eventId, ...eventData };
            console.log('Event updated:', this.events[eventIndex]);
        }
    }

    deleteEvent() {
        if (this.editingEventId && confirm('Are you sure you want to delete this event?')) {
            console.log('Deleting event:', this.editingEventId);
            this.events = this.events.filter(event => event.id !== this.editingEventId);
            this.closeModal();
            this.renderCalendar();
        }
    }

    handleKeyDown(e) {
        if (e.key === 'Escape') {
            this.closeModal();
        }
        
        // Arrow key navigation for calendar
        if (document.activeElement && document.activeElement.classList.contains('date-cell')) {
            const currentCell = document.activeElement;
            const allCells = Array.from(document.querySelectorAll('.date-cell'));
            const currentIndex = allCells.indexOf(currentCell);
            
            let newIndex = currentIndex;
            
            switch (e.key) {
                case 'ArrowLeft':
                    newIndex = currentIndex - 1;
                    break;
                case 'ArrowRight':
                    newIndex = currentIndex + 1;
                    break;
                case 'ArrowUp':
                    newIndex = currentIndex - 7;
                    break;
                case 'ArrowDown':
                    newIndex = currentIndex + 7;
                    break;
                default:
                    return;
            }
            
            if (newIndex >= 0 && newIndex < allCells.length) {
                e.preventDefault();
                allCells[newIndex].focus();
            }
        }
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    isSameDate(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }
}

// Initialize the calendar when the DOM is loaded
let calendarApp;

function initializeCalendar() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            calendarApp = new CalendarApp();
        });
    } else {
        calendarApp = new CalendarApp();
    }
}

initializeCalendar();