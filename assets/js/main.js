/**
* Template Name: Green
* Template URL: https://bootstrapmade.com/green-free-one-page-bootstrap-template/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

export function initTheme() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader) return;
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    if(mobileNavToggleBtn) {
       mobileNavToggleBtn.classList.toggle('bi-list');
       mobileNavToggleBtn.classList.toggle('bi-x');
    }
  }
  if(mobileNavToggleBtn) {
      mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
      preloader.remove();
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  if(scrollTop) {
      scrollTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   * Usamos requestAnimationFrame para no bloquear el initial render (evita forced reflow)
   */
  function aosInit() {
      if(typeof AOS !== 'undefined') {
        AOS.init({
          duration: 600,
          easing: 'ease-in-out',
          once: true,
          mirror: false
        });
      }
  }
  // Diferir hasta despues del primer paint: elimina ~268ms de forced reflow
  window.addEventListener('load', () => {
    requestAnimationFrame(() => {
      setTimeout(aosInit, 100);
    });
  });


  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
         // Custom function removed or implement here
      } else {
         if(typeof Swiper !== 'undefined') new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);
  initSwiper();


  /**
   * Navmenu Scrollspy - Optimized to avoid forced reflow
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');
  let sectionOffsets = [];

  function cacheOffsets() {
    sectionOffsets = [];
    navmenulinks.forEach(link => {
      if (!link.hash) return;
      let section = document.querySelector(link.hash);
      if (section) {
        sectionOffsets.push({
          link: link,
          offsetTop: section.offsetTop,
          offsetHeight: section.offsetHeight
        });
      }
    });
  }

  function navmenuScrollspy() {
    let position = window.scrollY + 200;
    sectionOffsets.forEach(item => {
      if (position >= item.offsetTop && position <= (item.offsetTop + item.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        item.link.classList.add('active');
      } else {
        item.link.classList.remove('active');
      }
    });
  }

  window.addEventListener('load', () => {
    cacheOffsets();
    navmenuScrollspy();
  });
  window.addEventListener('resize', cacheOffsets);
  document.addEventListener('scroll', navmenuScrollspy);


}

window.changeLang = function(lang) {
    localStorage.setItem('lang', lang);
    location.reload();
};