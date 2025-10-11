// Smooth scrolling para los enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Actualizar enlace activo inmediatamente
            updateActiveNavLink(this.getAttribute('href'));
        }
    });
});

// Active navigation indicator
function updateActiveNavLink(sectionId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === sectionId) {
            link.classList.add('active');
        }
    });
}

// Detectar sección activa al hacer scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNavOnScroll() {
    const scrollPosition = window.scrollY + 200; // Offset para activar antes
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = '#' + section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === sectionId) {
                    link.classList.add('active');
                }
            });
        }
    });
    
    // Si estamos en el top de la página, activar "Inicio"
    if (window.scrollY < 100) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#inicio') {
                link.classList.add('active');
            }
        });
    }
}

// Ejecutar al cargar y al hacer scroll
window.addEventListener('scroll', throttle(highlightNavOnScroll, 100), { passive: true });
window.addEventListener('load', highlightNavOnScroll);

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    let lastRan;
    return function executedFunction(...args) {
        if (!lastRan) {
            func(...args);
            lastRan = Date.now();
        } else {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if ((Date.now() - lastRan) >= wait) {
                    func(...args);
                    lastRan = Date.now();
                }
            }, wait - (Date.now() - lastRan));
        }
    };
}

// Efecto de scroll en el header
let lastScrollY = window.scrollY;
const header = document.querySelector('.header');
const navContainer = document.querySelector('.nav-container');
let ticking = false;

// Ajusta padding-top del main según la altura del header
function setHeaderHeightVar() {
    const main = document.querySelector('main');
    if (header && main) {
        const height = header.offsetHeight;
        document.documentElement.style.setProperty('--header-height', height + 'px');
    }
}

window.addEventListener('load', setHeaderHeightVar);
window.addEventListener('resize', throttle(setHeaderHeightVar, 100));

// Scroll handler optimizado con requestAnimationFrame
function handleScroll() {
    const currentScrollY = window.scrollY;

    // Hide/show header on scroll
    if (currentScrollY > lastScrollY && currentScrollY > 200) {
        if (header) header.style.transform = 'translateY(-100%)';
    } else {
        if (header) header.style.transform = 'translateY(0)';
    }
    
    lastScrollY = currentScrollY;
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
    }
}, { passive: true });

// Mobile navigation toggle
const navToggle = document.getElementById('nav-toggle');
const navLinksContainer = document.querySelector('.nav-links');

if (navToggle && navLinksContainer) {
    navToggle.addEventListener('click', function() {
        navLinksContainer.classList.toggle('active');
        navToggle.classList.toggle('active');

        // Ajusta la posición del menú móvil según la altura actual del header
        if (header && navLinksContainer.classList.contains('active')) {
            navLinksContainer.style.top = getComputedStyle(document.documentElement).getPropertyValue('--header-height') || (header.offsetHeight + 'px');
        }
    });
    
    // Cerrar menú móvil al hacer clic en un enlace
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navLinksContainer.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });
}

// Scroll reveal animation (optimizado)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            // Dejar de observar una vez revelado para mejorar rendimiento
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Acordeón interactivo de Agoney
document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', function() {
        const accordionItem = this.parentElement;
        const isActive = accordionItem.classList.contains('active');
        
        // Cerrar todos los acordeones
        document.querySelectorAll('.accordion-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Abrir el acordeón clickeado si no estaba activo
        if (!isActive) {
            accordionItem.classList.add('active');
        }
    });
});

// Apply scroll reveal to elements
document.addEventListener('DOMContentLoaded', function() {
    const revealElements = document.querySelectorAll('.curso-card, .beneficio-item, .testimonio-card, .section-header, .agoney-image-container, .agoney-info');
    revealElements.forEach(element => {
        element.classList.add('scroll-reveal');
        observer.observe(element);
    });
});

// Parallax effect for hero section (optimizado)
let parallaxTicking = false;
const heroImage = document.querySelector('.hero-image');
const floatingCards = document.querySelectorAll('.floating-card');

// Solo aplicar parallax si el usuario no está en un dispositivo móvil
const isMobile = window.innerWidth <= 768;

if (!isMobile && (heroImage || floatingCards.length > 0)) {
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        // Solo aplicar parallax si estamos en la sección hero
        if (scrolled < window.innerHeight) {
            if (heroImage) {
                heroImage.style.transform = `translate3d(0, ${scrolled * 0.1}px, 0)`;
            }
            
            floatingCards.forEach((card, index) => {
                const speed = 0.05 + (index * 0.02);
                card.style.transform = `translate3d(0, ${scrolled * speed}px, 0)`;
            });
        }
        
        parallaxTicking = false;
    }

    window.addEventListener('scroll', function() {
        if (!parallaxTicking) {
            window.requestAnimationFrame(updateParallax);
            parallaxTicking = true;
        }
    }, { passive: true });
}

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + (target >= 1000 ? '+' : '');
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + (target >= 1000 ? '+' : '');
        }
    }
    
    updateCounter();
}

// Trigger counter animation when stats come into view
const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseFloat(text.replace(/[^\d.]/g, ''));
                if (number) {
                    stat.textContent = '0';
                    animateCounter(stat, number, 2000);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// Form handling
const form = document.querySelector('.form');
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const name = form.querySelector('input[type="text"]').value;
        const email = form.querySelector('input[type="email"]').value;
        const message = form.querySelector('textarea').value;
        
        // Simple validation
        if (!name || !email || !message) {
            showNotification('Por favor, completa todos los campos', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Por favor, ingresa un email válido', 'error');
            return;
        }
        
        // Simulate form submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showNotification('¡Mensaje enviado correctamente! Te responderemos pronto.', 'success');
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--secondary-green)' : type === 'error' ? '#e74c3c' : 'var(--primary-color)'};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// CTA button interactions (optimizado)
document.querySelectorAll('.cta-primary').forEach(button => {
    button.addEventListener('click', function(e) {
        // Solo añadir efecto ripple en desktop
        if (window.innerWidth > 768) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        }
    });
});

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .nav-links.active {
        display: flex;
        position: fixed;
        top: var(--header-height, 96px);
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        flex-direction: column;
        padding: 20px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }
    
    .nav-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    @media (max-width: 768px) {
        .nav-links {
            display: none;
        }
    }
`;
document.head.appendChild(style);

// Lazy loading for images
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// Add loading animation (optimizado)
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Animate hero elements con requestAnimationFrame
    const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-description, .hero-actions, .hero-stats');
    heroElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translate3d(0, 30px, 0)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            requestAnimationFrame(() => {
                element.style.opacity = '1';
                element.style.transform = 'translate3d(0, 0, 0)';
            });
        }, index * 100);
    });
});

// Optimización: usar CSS para transiciones en lugar de JS
// Ya están definidas en el archivo CSS