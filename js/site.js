/* Comportamentos da página: menu do celular, carrossel, animações de entrada e contadores. */
(function () {
  // Ano do rodapé
  var ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();

  // Menu do celular
  var menu = document.getElementById("menu-mobile");
  function abrir() {
    menu.hidden = false;
    menu.classList.add("entrando");
    document.body.classList.add("overflow-hidden");
    requestAnimationFrame(function () { requestAnimationFrame(function () { menu.classList.remove("entrando"); }); });
  }
  function fechar() {
    menu.hidden = true;
    document.body.classList.remove("overflow-hidden");
  }
  document.getElementById("menu-abrir").addEventListener("click", abrir);
  document.getElementById("menu-fechar").addEventListener("click", fechar);
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) fechar(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) fechar(); });

  // Carrossel "Estamos nos canais que você confia"
  if (window.Swiper) {
    var carrossel = new Swiper(".swiper", {
      loop: true,
      breakpoints: { 640: { slidesPerView: 1 }, 768: { slidesPerView: 3 }, 1024: { slidesPerView: 4 } }
    });
    document.querySelector("[data-prev]").addEventListener("click", function () { carrossel.slidePrev(); });
    document.querySelector("[data-next]").addEventListener("click", function () { carrossel.slideNext(); });
  }

  // Animações de entrada e contadores
  function contar(el) {
    var alvo = Number(el.dataset.count), inicio = performance.now();
    (function passo(agora) {
      var p = Math.min((agora - inicio) / 2000, 1);
      el.textContent = Math.round(alvo * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(passo);
    })(inicio);
  }
  var alvos = document.querySelectorAll("[data-reveal],[data-fade],[data-count]");
  if (!("IntersectionObserver" in window)) {
    alvos.forEach(function (el) { el.classList.add("visivel"); if (el.dataset.count) el.textContent = el.dataset.count; });
    return;
  }
  var obs = new IntersectionObserver(function (itens) {
    itens.forEach(function (i) {
      if (!i.isIntersecting) return;
      obs.unobserve(i.target);
      if (i.target.dataset.count) contar(i.target); else i.target.classList.add("visivel");
    });
  }, { threshold: 0.15 });
  alvos.forEach(function (el) { obs.observe(el); });
})();
