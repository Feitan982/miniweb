const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

menuToggle.addEventListener('click', () => {
	const isOpen = siteNav.classList.toggle('is-open');
	menuToggle.setAttribute('aria-expanded', String(isOpen));
});

siteNav.querySelectorAll('a').forEach((link) => {
	link.addEventListener('click', () => {
		siteNav.classList.remove('is-open');
		menuToggle.setAttribute('aria-expanded', 'false');
	});
});

document.querySelector('#year').textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			entry.target.classList.add('is-visible');
			revealObserver.unobserve(entry.target);
		}
	});
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
jsgssvbs
