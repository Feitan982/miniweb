document.addEventListener('DOMContentLoaded', () => {
	const body = document.body;
	const navLinks = document.querySelector('.nav-links');
	const hamburger = document.querySelector('.hamburger');
	const themeToggle = document.querySelector('#themeToggle');

	hamburger?.addEventListener('click', () => {
		const open = navLinks.classList.toggle('open');
		hamburger.setAttribute('aria-expanded', String(open));
	});
	navLinks?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
		navLinks.classList.remove('open');
		hamburger?.setAttribute('aria-expanded', 'false');
	}));

	const savedTheme = localStorage.getItem('portfolio-theme');
	if (savedTheme === 'dark') body.classList.add('dark-theme');
	themeToggle?.addEventListener('click', () => {
		const dark = body.classList.toggle('dark-theme');
		localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light');
		document.querySelector('#themeToggleText').textContent = dark ? 'Light' : 'Theme';
	});

	const techCategories = [
		['Language', 'Python'], ['Language', 'JavaScript'], ['Language', 'C++'], ['Language', 'C#'], ['Language', 'VB.NET'],
		['Frontend', 'HTML5'], ['Frontend', 'CSS3'], ['Frontend', 'Responsive UI/UX'], ['Frontend', 'Tailwind CSS'],
		['Backend', 'FastAPI'], ['Backend', 'Firebase'], ['Backend', 'WebSockets'],
		['Database', 'SQLite'], ['Database', 'Firebase Firestore'],
		['Hardware & IoT', 'ESP32'], ['Hardware & IoT', 'AMG8833'], ['Hardware & IoT', 'GSM'], ['Hardware & IoT', 'Arduino IDE'],
		['Tools & Platforms', 'Git'], ['Tools & Platforms', 'PWA'], ['Tools & Platforms', 'AI / NLP'], ['Tools & Platforms', 'Chart.js']
	];
	document.querySelector('#tech-stack-featured').innerHTML = `
		<div class="tech-table-wrap">
			<table class="tech-table">
				<caption class="sr-only">Gabriel's technology categories</caption>
				<thead><tr><th scope="col">Area</th><th scope="col">Technology</th></tr></thead>
				<tbody>${techCategories.map(([category, tools]) => `<tr><th scope="row">${category}</th><td>${tools}</td></tr>`).join('')}</tbody>
			</table>
		</div>`;
	document.querySelector('#tech-stack-grid').innerHTML = '<p class="tech-stack-note">Focused on practical systems that connect clean interfaces, reliable data, and real-world devices.</p>';

	const canvas = document.querySelector('#particle-canvas');
	const context = canvas?.getContext('2d');
	if (canvas && context && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		const pointer = { x: -1000, y: -1000, active: false };
		const ripples = [];
		const dots = Array.from({ length: 78 }, (_, index) => ({
			radius: Math.sqrt(Math.random()),
			angle: Math.random() * Math.PI * 2,
			arm: index % 4,
			r: index % 3 === 0 ? 3.5 : 2,
			speed: .000015 + Math.random() * .000025,
			phase: Math.random() * Math.PI * 2
		}));
		const resizeCanvas = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
		const updatePointer = (event) => { pointer.x = event.clientX; pointer.y = event.clientY; pointer.active = true; };
		const resetPointer = () => { pointer.active = false; pointer.x = -1000; pointer.y = -1000; };
		const addRipple = (event) => { ripples.push({ x: event.clientX, y: event.clientY, radius: 4, opacity: .55 }); };
		const drawCanvas = (time) => {
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.fillStyle = getComputedStyle(document.body).getPropertyValue('--accent').trim();
			dots.forEach((dot) => {
			const centerX = canvas.width * .54;
			const centerY = canvas.height * .46;
			const orbit = dot.angle + dot.radius * 3.8 + dot.arm * (Math.PI * 2 / 4) + time * dot.speed;
			const orbitSize = Math.max(canvas.width, canvas.height) * .72 * dot.radius;
			const baseX = centerX + Math.cos(orbit) * orbitSize;
			const baseY = centerY + Math.sin(orbit) * orbitSize * .55;
			const distanceX = pointer.x - baseX;
			const distanceY = pointer.y - baseY;
			const distance = Math.hypot(distanceX, distanceY);
			const influence = pointer.active && distance < 180 ? (1 - distance / 180) * 16 : 0;
			const x = baseX + (distanceX / (distance || 1)) * influence;
			const y = baseY + (distanceY / (distance || 1)) * influence + Math.sin(time * .001 + dot.phase) * 2;
			context.globalAlpha = .55;
			context.beginPath();
			context.arc(x, y, dot.r, 0, Math.PI * 2);
			context.fill();
			if (pointer.active && distance < 150) {
				context.globalAlpha = .2 * (1 - distance / 150);
				context.beginPath();
				context.moveTo(x, y);
				context.lineTo(pointer.x, pointer.y);
				context.strokeStyle = context.fillStyle;
				context.stroke();
			}
		});
		ripples.splice(0, ripples.length, ...ripples.filter((ripple) => ripple.opacity > .01));
		ripples.forEach((ripple) => {
			ripple.radius += 2.5;
			ripple.opacity *= .94;
			context.globalAlpha = ripple.opacity;
			context.lineWidth = 1;
			context.strokeStyle = context.fillStyle;
			context.beginPath();
			context.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
			context.stroke();
		});
			window.requestAnimationFrame(drawCanvas);
		};
		resizeCanvas();
		window.addEventListener('resize', resizeCanvas);
		window.addEventListener('pointermove', updatePointer, { passive: true });
		window.addEventListener('pointerout', resetPointer, { passive: true });
		window.addEventListener('click', addRipple);
		window.requestAnimationFrame(drawCanvas);
	}

	document.querySelectorAll('.tabs, .community-tabs').forEach((tabList) => {
		tabList.querySelectorAll('[role="tab"]').forEach((tab) => tab.addEventListener('click', () => {
			const group = tabList.parentElement;
			tabList.querySelectorAll('[role="tab"]').forEach((item) => {
				item.classList.toggle('active', item === tab);
				item.setAttribute('aria-selected', String(item === tab));
				item.tabIndex = item === tab ? 0 : -1;
			});
			group.querySelectorAll('[role="tabpanel"]').forEach((panel) => {
				const active = panel.id === tab.getAttribute('aria-controls');
				panel.hidden = !active;
				panel.classList.toggle('active', active);
			});
		}));
	});

	const modal = (id) => document.querySelector(id);
	const openModal = (element) => { element?.classList.add('open'); body.classList.add('modal-open'); };
	const closeModal = (element) => { element?.classList.remove('open'); body.classList.remove('modal-open'); };
	const emailModal = modal('#emailModal');
	document.querySelector('#openEmailModal')?.addEventListener('click', () => openModal(emailModal));
	document.querySelectorAll('.email-modal-close, #cancelBtn').forEach((button) => button.addEventListener('click', () => closeModal(emailModal)));
	document.querySelector('#contactForm')?.addEventListener('submit', (event) => {
		event.preventDefault();
		const form = event.currentTarget;
		const subject = encodeURIComponent(form.subject.value);
		const bodyText = encodeURIComponent(`${form.body.value}\n\nFrom: ${form.name.value}`);
		window.location.href = `mailto:gabrielagsamosam@gmail.com?subject=${subject}&body=${bodyText}`;
		closeModal(emailModal);
	});

	const projectModal = modal('#projectModal');
	const projects = {
		pos: ['POS And Inventory System', 'Role-based access, sales dashboard, inventory control, and database backup workflows built with VB.NET and SQLite.'],
		thermal: ['ThermE.Y.E.', 'An ESP32 thermal monitoring system that streams sensor data through Firebase and WebSockets and can trigger GSM alerts.'],
		mybudget: ['MyBudget-Finance', 'An offline-first personal finance PWA for expenses, income, savings goals, and recurring bills.'],
		acadhub: ['AcadHub Suite', 'An AI-assisted study workspace for turning notes into flashcards, quizzes, and focused study plans.']
	};
	document.querySelectorAll('.btn-view-details').forEach((button) => button.addEventListener('click', () => {
		const project = projects[button.dataset.project];
		if (!project) return;
		document.querySelector('#projectModalTitle').textContent = project[0];
		document.querySelector('#projectModalFeatures').innerHTML = `<p>${project[1]}</p>`;
		document.querySelector('#projectGallery').innerHTML = '<div class="gallery-card">Project preview available through the linked repository or live demo.</div>';
		openModal(projectModal);
	}));
	projectModal?.querySelector('.modal-close-btn')?.addEventListener('click', () => closeModal(projectModal));
	document.querySelectorAll('.modal-overlay').forEach((overlay) => overlay.addEventListener('click', (event) => {
		if (event.target === overlay) closeModal(overlay);
	}));
	document.addEventListener('keydown', (event) => { if (event.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(closeModal); });

	const assistantReplies = [
		['projects', 'Gabriel has built a VB.NET POS system, the ThermE.Y.E. IoT monitor, MyBudget-Finance, and AcadHub Suite.'],
		['therm', 'ThermE.Y.E. combines an ESP32, AMG8833 thermal sensors, Firebase, WebSockets, and GSM alerts for real-time monitoring.'],
		['technolog', 'His current toolkit includes HTML, CSS, JavaScript, C++, C#, Python, VB.NET, Firebase, SQLite, and ESP32 hardware.'],
		['experience', 'Gabriel works across practical web, desktop, and IoT projects, with freelance web development experience since 2024.'],
		['hire', 'The best way to reach Gabriel is through the email form below or the contact links on this page.'],
		['service', 'He can help with responsive websites, small business tools, dashboards, and connected hardware prototypes.']
	];
	const chatForm = document.querySelector('#chatForm');
	const chatMessages = document.querySelector('#chatMessages');
	const addMessage = (text, user = false) => {
		const message = document.createElement('div');
		message.className = `chat-message ${user ? 'chat-message-user' : 'chat-message-assistant'}`;
		message.innerHTML = `<div class="chat-message-header"><span>${user ? 'You' : "Gabriel's Assistant"}</span><time>Now</time></div><p></p>`;
		message.querySelector('p').textContent = text;
		chatMessages.appendChild(message);
		chatMessages.scrollTop = chatMessages.scrollHeight;
	};
	const answer = (question) => assistantReplies.find(([keyword]) => question.toLowerCase().includes(keyword))?.[1] || 'That is a thoughtful question. Ask me about Gabriel\'s projects, technologies, experience, services, or how to get in touch.';
	const ask = (question) => { if (!question.trim()) return; addMessage(question, true); window.setTimeout(() => addMessage(answer(question)), 350); };
	chatForm?.addEventListener('submit', (event) => { event.preventDefault(); const input = chatForm.message; ask(input.value); input.value = ''; });
	document.querySelectorAll('.chat-prompt').forEach((prompt) => prompt.addEventListener('click', () => ask(prompt.textContent)));
	document.querySelector('#clearChatBtn')?.addEventListener('click', () => { chatMessages.innerHTML = ''; addMessage('Chat cleared. What would you like to know about Gabriel\'s work?'); });

	const sections = document.querySelectorAll('.fade-in-section');
	const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) observer.unobserve(entry.target); entry.target.classList.toggle('is-visible', entry.isIntersecting); }), { threshold: .12 });
	sections.forEach((section) => observer.observe(section));
	const backToTop = document.querySelector('#backToTop');
	window.addEventListener('scroll', () => backToTop?.classList.toggle('visible', window.scrollY > 500), { passive: true });
	backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

	const profile = document.querySelector('.profile-image');
	profile?.addEventListener('error', () => { profile.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Crect width="400" height="400" fill="%23e06b3c"/%3E%3Ctext x="200" y="225" text-anchor="middle" font-family="sans-serif" font-size="110" font-weight="700" fill="white"%3EGA%3C/text%3E%3C/svg%3E'; });
});