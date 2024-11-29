document.addEventListener('DOMContentLoaded', function () {
    // Smooth scroll for menu links
    const menuLinks = document.querySelectorAll('nav a[href^="#"]');
    menuLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        });
    });

    // Smooth appearance on scroll
    const scrollElements = document.querySelectorAll('.js-scroll');
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('scrolled');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach(el => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            }
        });
    };

    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });
});


// pegar dados form e mandar whatsapp
const form = document.querySelector('form');
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const celular = document.getElementById('celular').value;
    const mensagem = document.getElementById('mensagem').value;

    const whatsappMessage = `Nome: ${nome}\nCelular: ${celular}\nMensagem: ${mensagem}`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=+5514997746343&text=${encodeURIComponent(whatsappMessage)}`;

    window.open(whatsappUrl, '_blank');
});

//comentarios
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const bullets = document.querySelectorAll('.bullet');
const reviews = document.querySelectorAll('.avaliacao');
let currentIndex = 0;
let autoSlideInterval;

const updateReviews = (index, direction = 'right') => {
    reviews.forEach((review) => {
        review.style.display = 'none';
        review.classList.remove('slide-in-left', 'slide-in-right');
    });
    bullets.forEach((bullet, i) => {
        bullet.classList.toggle('active', i === index);
    });

    reviews[index].style.display = 'block';
    reviews[index].classList.add(direction === 'left' ? 'slide-in-left' : 'slide-in-right');

    // Remove opacity transitions
    // reviews[index].style.opacity = '0';
    // setTimeout(() => {
    //     reviews[index].style.transition = 'opacity 0.5s ease-in-out';
    //     reviews[index].style.opacity = '1';
    // }, 400);
};

const startAutoSlide = () => {
    autoSlideInterval = setInterval(() => {
        currentIndex = (currentIndex < reviews.length - 1) ? currentIndex + 1 : 0;
        updateReviews(currentIndex, 'right');
    }, 4000); // Change slide every 3 seconds
};

const stopAutoSlide = () => {
    clearInterval(autoSlideInterval);
};

prevButton.addEventListener('click', () => {
    stopAutoSlide();
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : reviews.length - 1;
    updateReviews(currentIndex, 'left');
    startAutoSlide();
});

nextButton.addEventListener('click', () => {
    stopAutoSlide();
    currentIndex = (currentIndex < reviews.length - 1) ? currentIndex + 1 : 0;
    updateReviews(currentIndex, 'right');
    startAutoSlide();
});

//alterar avaliações pelo bullet
bullets.forEach((bullet, index) => {
    bullet.addEventListener('click', () => {
        stopAutoSlide();
        currentIndex = index;
        updateReviews(currentIndex, 'right');
        startAutoSlide();
    });
});

//alterar avaliação pelas setas
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        stopAutoSlide();
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : reviews.length - 1;
        updateReviews(currentIndex, 'left');
        startAutoSlide();
    } else if (e.key === 'ArrowRight') {
        stopAutoSlide();
        currentIndex = (currentIndex < reviews.length - 1) ? currentIndex + 1 : 0;
        updateReviews(currentIndex, 'right');
        startAutoSlide();
    }
});

// Initialize the first review and start auto slide
document.addEventListener('DOMContentLoaded', () => {
    updateReviews(currentIndex, 'right');
    startAutoSlide();
});

// Initialize the first review
updateReviews(currentIndex);


// Scroll to top button
const scrollToTopButton = document.querySelector('.scroll-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopButton.style.opacity = '1';
        scrollToTopButton.style.display = 'block';
    } else {
        scrollToTopButton.style.opacity = '0';
        scrollToTopButton.style.display = 'none';
    }
});

scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

//menu mobile toggle funcionando
const menuIcon = document.querySelector('.menu-icon');
const navLinks = document.querySelector('.nav-links');

menuIcon.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = menuIcon.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
    
    // Remove maxHeight manipulation - let CSS handle it
    navLinks.style.maxHeight = navLinks.classList.contains('active') ? '300px' : '0';
});

// Add transition for menu icon
const menuIconTransition = document.createElement('style');
menuIconTransition.innerHTML = `
    .menu-icon i {
        transition: transform 0.3s ease-in-out;
    }
    .menu-icon i.fa-times {
        transform: rotate(90deg);
    }
`;
document.head.appendChild(menuIconTransition);

document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !menuIcon.contains(e.target)) {
        navLinks.classList.remove('active');
        menuIcon.querySelector('i').classList.remove('fa-times');
        menuIcon.querySelector('i').classList.add('fa-bars');
        navLinks.style.maxHeight = '0';
    }
});

// Ensure smooth transition on first click
document.addEventListener('DOMContentLoaded', () => {
    navLinks.style.maxHeight = '0';
});
