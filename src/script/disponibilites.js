(() => {
	const MONTHS = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"];
	const now = new Date(), elements = {
		monthLabel: document.getElementById("monthLabel"),
		calendarGrid: document.getElementById("calendarGrid"),
		monthSelect: document.getElementById("monthSelect"),
		yearSelect: document.getElementById("yearSelect"),
		prevBtn: document.getElementById("prevMonth"),
		nextBtn: document.getElementById("nextMonth"),
	};
	let viewYear = now.getFullYear(), viewMonth = now.getMonth();

	const populateSelectors = () => {
		MONTHS.forEach((m, i) => {
			const opt = document.createElement("option");
			opt.value = i;
			opt.textContent = m;
			elements.monthSelect.appendChild(opt);
		});
		for (let y = now.getFullYear() - 5; y <= now.getFullYear() + 5; y++) {
			const opt = document.createElement("option");
			opt.value = y;
			opt.textContent = y;
			elements.yearSelect.appendChild(opt);
		}
	};

	const renderCalendar = (year, month) => {
		const first = new Date(year, month, 1), daysInMonth = new Date(year, month + 1, 0).getDate();
		const offset = (first.getDay() + 6) % 7, prevDays = new Date(year, month, 0).getDate();
		elements.monthLabel.textContent = `${MONTHS[month]} ${year}`;
		elements.monthSelect.value = month;
		elements.yearSelect.value = year;
		elements.calendarGrid.innerHTML = "";

		for (let i = 0; i < offset; i++) {
			const cell = document.createElement("div");
			cell.className = "cell muted";
			cell.textContent = prevDays - offset + i + 1;
			elements.calendarGrid.appendChild(cell);
		}

		for (let d = 1; d <= daysInMonth; d++) {
			const btn = document.createElement("button");
			btn.type = "button";
			btn.className = "cell";
			btn.textContent = d;
			if (d === now.getDate() && month === now.getMonth() && year === now.getFullYear()) btn.classList.add("today");
			elements.calendarGrid.appendChild(btn);
		}

		const total = offset + daysInMonth, trailing = total % 7 === 0 ? 0 : 7 - (total % 7);
		for (let t = 1; t <= trailing; t++) {
			const cell = document.createElement("div");
			cell.className = "cell muted";
			cell.textContent = t;
			elements.calendarGrid.appendChild(cell);
		}
	};

	const shiftMonth = (delta) => {
		viewMonth += delta;
		if (viewMonth < 0) { viewMonth = 11; viewYear--; }
		else if (viewMonth > 11) { viewMonth = 0; viewYear++; }
		renderCalendar(viewYear, viewMonth);
	};

	elements.monthSelect.addEventListener("change", (e) => { viewMonth = Number(e.target.value); renderCalendar(viewYear, viewMonth); });
	elements.yearSelect.addEventListener("change", (e) => { viewYear = Number(e.target.value); renderCalendar(viewYear, viewMonth); });
	elements.prevBtn.addEventListener("click", () => shiftMonth(-1));
	elements.nextBtn.addEventListener("click", () => shiftMonth(1));

	populateSelectors();
	renderCalendar(viewYear, viewMonth);
})();
