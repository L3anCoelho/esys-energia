/* =========================================================
   APP.JS — ESYS (UNIFICADO)
   Inclui:
   - GLOBAL (WhatsApp, reveal, footer year)
   - HOME (hero carrossel, simulador, depoimentos, parceiros, stats)
   - ELETROMOBILIDADE (carrossel hero, simulador EV, combo solar+carregador)
   - SMARTHOME (vídeo hero + toggle som)
========================================================= */

/* =========================
   ✅ CONFIG WHATSAPP (GLOBAL)
========================= */
const WHATSAPP_NUMEROS = {
  principal: "5511996187450",
  comercial: "5511978230095",
  suporte: "5511998864287",
};

// 
const WHATSAPP_ATIVO = WHATSAPP_NUMEROS.principal;

function montarLinkWhats(mensagem, numero = WHATSAPP_ATIVO) {
  const texto = encodeURIComponent(mensagem);
  return `https://wa.me/${numero}?text=${texto}`;
}

document.addEventListener("DOMContentLoaded", () => {
  /* =========================================================
     ✅ GLOBAL — roda em qualquer página 
  ========================================================= */

  // ✅ WhatsApp topo (botão no header)
  const btnOrcamentoTopo = document.getElementById("btnOrcamentoTopo");
  if (btnOrcamentoTopo) {
    btnOrcamentoTopo.addEventListener("click", () => {
      window.open(
        montarLinkWhats("Olá! Quero pedir um orçamento de energia solar."),
        "_blank",
        "noopener"
      );
    });
  }

  // ✅ Whats flutuante (se existir na página)
  const whatsFloat = document.getElementById("whatsFloat");
  if (whatsFloat) {
    whatsFloat.href = montarLinkWhats(
      "Olá! Quero tirar uma dúvida e pedir um orçamento de energia solar."
    );
  }

  // ✅ Reveal 
  const els = document.querySelectorAll(".reveal");
  if (els.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
  }

  // ✅ Ano do footer
  const footerYear = document.getElementById("footerYear");
  if (footerYear) footerYear.textContent = new Date().getFullYear();



  // =========================
  // ✅ HERO CARROSSEL 
  // =========================
  const heroBg = document.getElementById("heroBg");
  const heroTrack = document.getElementById("heroTrack");
  const heroDots = document.getElementById("heroDots");
  const hero = document.getElementById("hero") || document.querySelector(".hero");

  const heroSlides = [
    { img: "hero 1.png", href: null },
    { img: "hero 2.png", href: null },
    { img: "hero smarthome.png", href: "smarthome.html" },
    { img: "hero eletro.png", href: "eletromobilidade.html" },
  ];

  if (heroBg && heroTrack && heroDots && hero && heroSlides.length) {
    let heroIndex = 0;
    let heroTimer = null;

    function buildSlides() {
      heroTrack.innerHTML = "";
      heroSlides.forEach((s) => {
        const slide = document.createElement("div");
        slide.className = "hero-slide";
        slide.style.backgroundImage = `url("${s.img}")`;
        heroTrack.appendChild(slide);
      });
    }

    function buildDots() {
      heroDots.innerHTML = "";
      for (let i = 0; i < heroSlides.length; i++) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "hero-dot" + (i === 0 ? " active" : "");
        b.setAttribute("aria-label", `Ir para imagem ${i + 1}`);
        b.addEventListener("click", () => goTo(i));
        heroDots.appendChild(b);
      }
    }

    function setActiveDot() {
      const dots = heroDots.querySelectorAll(".hero-dot");
      dots.forEach((d, i) => d.classList.toggle("active", i === heroIndex));
    }

    function updateCursor() {
      const hasLink = !!heroSlides[heroIndex]?.href;
      hero.classList.toggle("is-link", hasLink);
    }

    function applyTransform() {
      heroTrack.style.transform = `translateX(-${heroIndex * 100}%)`;
    }

    function goTo(i) {
      heroIndex = (i + heroSlides.length) % heroSlides.length;
      applyTransform();
      setActiveDot();
      updateCursor();
    }

    function startAuto() {
      stopAuto();
      heroTimer = setInterval(() => goTo(heroIndex + 1), 5500);
    }

    function stopAuto() {
      if (heroTimer) clearInterval(heroTimer);
      heroTimer = null;
    }

    // Clique no hero (se slide tiver link)
    hero.addEventListener("click", (e) => {
      if (e.target.closest("#btnOrcamentoTopo") || e.target.closest(".hero-dot")) return;
      const href = heroSlides[heroIndex]?.href;
      if (href) window.location.href = href;
    });

    window.addEventListener("resize", applyTransform);

    buildSlides();
    buildDots();
    goTo(0);
    startAuto();
  }

  // =========================
  // ✅ SIMULADOR (HOME)
  // =========================
  const btnSimular = document.getElementById("btnSimular");
  const inputNome = document.getElementById("nome");
  const inputEmail = document.getElementById("email");
  const inputTelefone = document.getElementById("telefone");
  const inputConta = document.getElementById("conta");
  const formError = document.getElementById("formError");

  function setError(msg) {
    if (!formError) return;
    formError.textContent = msg;
    formError.style.display = "block";
  }

  function clearError() {
    if (!formError) return;
    formError.textContent = "";
    formError.style.display = "none";
  }

  function markInvalid(el, invalid) {
    if (!el) return;
    el.classList.toggle("is-invalid", !!invalid);
  }

  function onlyDigits(v) {
    return (v || "").replace(/\D/g, "");
  }

  function formatPhoneBR(raw) {
    const d = onlyDigits(raw).slice(0, 11);
    if (d.length <= 2) return d;
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }

  function isValidEmail(email) {
    const e = (email || "").trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
  }

  function isValidPhone(phone) {
    const d = onlyDigits(phone);
    return d.length === 10 || d.length === 11;
  }

  if (inputTelefone) {
    inputTelefone.addEventListener("input", () => {
      inputTelefone.value = formatPhoneBR(inputTelefone.value);
      markInvalid(inputTelefone, false);
      clearError();
    });
  }

  [inputNome, inputEmail, inputConta].forEach((el) => {
    if (!el) return;
    el.addEventListener("input", () => {
      markInvalid(el, false);
      clearError();
    });
  });

  if (btnSimular) {
    btnSimular.addEventListener("click", () => {
      clearError();

      btnSimular.disabled = true;
      setTimeout(() => (btnSimular.disabled = false), 550);

      const nome = (inputNome?.value || "").trim();
      const email = (inputEmail?.value || "").trim();
      const telefone = (inputTelefone?.value || "").trim();
      const contaRaw = (inputConta?.value || "").trim().replace(",", ".");
      const conta = parseFloat(contaRaw);

      let ok = true;

      if (!nome) {
        ok = false;
        markInvalid(inputNome, true);
      }
      if (!isValidEmail(email)) {
        ok = false;
        markInvalid(inputEmail, true);
      }
      if (!isValidPhone(telefone)) {
        ok = false;
        markInvalid(inputTelefone, true);
      }
      if (Number.isNaN(conta) || conta <= 0) {
        ok = false;
        markInvalid(inputConta, true);
      }

      if (!ok) {
        setError("Corrija os campos destacados para simular e receber no WhatsApp.");
        return;
      }

      const economia = conta * 0.9;

      const resNome = document.getElementById("resNome");
      const resConta = document.getElementById("resConta");
      const resEconomia = document.getElementById("resEconomia");
      const resultado = document.getElementById("resultado");

      if (resNome) resNome.innerText = nome;
      if (resConta) resConta.innerText = conta.toFixed(2);
      if (resEconomia) resEconomia.innerText = economia.toFixed(2);
      if (resultado) resultado.style.display = "block";

      const msg =
        `Olá! Me chamo ${nome}. Fiz a simulação no site.\n` +
        `Conta média: R$ ${conta.toFixed(2)}\n` +
        `Economia estimada: R$ ${economia.toFixed(2)}/mês\n` +
        `Telefone: ${telefone}\n` +
        `Quero uma proposta personalizada.`;

      const btnWhatsResultado = document.getElementById("btnWhatsResultado");
      if (btnWhatsResultado) btnWhatsResultado.href = montarLinkWhats(msg);
    });
  }

  // =========================
  // ✅ CARROSSEL DEPOIMENTOS (HOME)
  // =========================
  const depoTrack = document.getElementById("carouselTrack");
  const depoDotsWrap = document.getElementById("carouselDots");
  const depoPrev = document.getElementById("btnPrev");
  const depoNext = document.getElementById("btnNext");

  if (depoTrack && depoDotsWrap && depoPrev && depoNext) {
    const slides = Array.from(depoTrack.children);
    let index = 0;
    const total = slides.length;

    function buildDots() {
      depoDotsWrap.innerHTML = "";
      for (let i = 0; i < total; i++) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "carousel-dot" + (i === 0 ? " active" : "");
        b.setAttribute("aria-label", `Ir para depoimento ${i + 1}`);
        b.addEventListener("click", () => goTo(i));
        depoDotsWrap.appendChild(b);
      }
    }

    function setActiveDot() {
      const dots = depoDotsWrap.querySelectorAll(".carousel-dot");
      dots.forEach((d, i) => d.classList.toggle("active", i === index));
    }

    function goTo(i) {
      index = (i + total) % total;
      depoTrack.style.transform = `translateX(-${index * 100}%)`;
      setActiveDot();
    }

    depoPrev.addEventListener("click", () => goTo(index - 1));
    depoNext.addEventListener("click", () => goTo(index + 1));

    buildDots();
    goTo(0);

    let timer = null;
    function startAutoPlay() {
      stopAutoPlay();
      timer = setInterval(() => goTo(index + 1), 6000);
    }
    function stopAutoPlay() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    startAutoPlay();

    const carousel = document.querySelector(".carousel-clean");
    if (carousel) {
      carousel.addEventListener("mouseenter", stopAutoPlay);
      carousel.addEventListener("mouseleave", startAutoPlay);
    }
  }

 
 // =========================
// ✅ CARROSSEL PARCEIROS (HOME) — infinito + setas + dots (FIX)
// =========================
const partnersTrack = document.getElementById("partnersTrack");
const partnersSection = document.querySelector(".partners");
const partnersPrev = document.getElementById("partnersPrev");
const partnersNext = document.getElementById("partnersNext");
const partnersDots = document.getElementById("partnersDots");
const partnersViewport = document.querySelector(".partners-viewport");

if (partnersTrack && partnersViewport) {
  // ✅ garante que roda 1x
  if (partnersTrack.dataset.inited === "1") {
    // nada
  } else {
    partnersTrack.dataset.inited = "1";

    const originalItems = Array.from(partnersTrack.children);
    const totalOriginal = originalItems.length;

    if (totalOriginal > 0) {
      // ✅ clona 1x
      const clonesBefore = originalItems.map((el) => el.cloneNode(true));
      const clonesAfter = originalItems.map((el) => el.cloneNode(true));

      clonesBefore.forEach((c) => partnersTrack.insertBefore(c, partnersTrack.firstChild));
      clonesAfter.forEach((c) => partnersTrack.appendChild(c));

      const allItems = Array.from(partnersTrack.children);

      let step = 0;
      let index = totalOriginal; // começa no “meio”
      let timer = null;
      let isAnimating = false;

      function setTransition(on) {
        partnersTrack.style.transition = on ? "transform .55s ease" : "none";
      }

      function applyTransform() {
        partnersTrack.style.transform = `translate3d(-${index * step}px, 0, 0)`;
      }

      function calcStep() {
        const style = window.getComputedStyle(partnersTrack);
        const gap = parseFloat(style.gap || "0") || 0;

        const sample = allItems[totalOriginal]; // primeiro original no meio
        if (!sample) return;

        const w = sample.getBoundingClientRect().width;
        step = w + gap;
      }

      function buildDots() {
        if (!partnersDots) return;
        partnersDots.innerHTML = "";
        for (let i = 0; i < totalOriginal; i++) {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "partners-dot" + (i === 0 ? " active" : "");
          b.setAttribute("aria-label", `Ir para parceiro ${i + 1}`);
          b.addEventListener("click", () => goToOriginal(i));
          partnersDots.appendChild(b);
        }
      }

      function setActiveDot(originalIndex) {
        if (!partnersDots) return;
        const dots = partnersDots.querySelectorAll(".partners-dot");
        dots.forEach((d, i) => d.classList.toggle("active", i === originalIndex));
      }

      function getOriginalIndex() {
        let oi = (index - totalOriginal) % totalOriginal;
        if (oi < 0) oi += totalOriginal;
        return oi;
      }

      function goToOriginal(i) {
        if (isAnimating) return;
        isAnimating = true;

        setTransition(true);
        index = totalOriginal + i;
        applyTransform();
        setActiveDot(i);
      }

      function next() {
        if (isAnimating) return;
        isAnimating = true;

        setTransition(true);
        index += 1;
        applyTransform();
        setActiveDot(getOriginalIndex());
      }

      function prev() {
        if (isAnimating) return;
        isAnimating = true;

        setTransition(true);
        index -= 1;
        applyTransform();
        setActiveDot(getOriginalIndex());
      }

      if (partnersNext) partnersNext.addEventListener("click", next);
      if (partnersPrev) partnersPrev.addEventListener("click", prev);

      partnersTrack.addEventListener("transitionend", () => {
        // ✅ wrap invisível (sem duplicar/bugar)
        if (index >= totalOriginal * 2) {
          setTransition(false);
          index -= totalOriginal;
          applyTransform();
          // força reflow pra “colar” sem animar
          void partnersTrack.offsetWidth;
        }

        if (index < totalOriginal) {
          setTransition(false);
          index += totalOriginal;
          applyTransform();
          void partnersTrack.offsetWidth;
        }

        isAnimating = false;
      });

      function startAuto() {
        stopAuto();
        timer = setInterval(next, 3500);
      }

      function stopAuto() {
        if (timer) clearInterval(timer);
        timer = null;
      }

      if (partnersSection) {
        partnersSection.addEventListener("mouseenter", stopAuto);
        partnersSection.addEventListener("mouseleave", startAuto);
      }

      async function waitImages() {
        const imgs = Array.from(partnersTrack.querySelectorAll("img"));
        if (!imgs.length) return;

        await Promise.all(
          imgs.map((img) => {
            // decode dá melhor resultado que só "load"
            if (img.decode) {
              return img.decode().catch(() => {});
            }
            return new Promise((res) => {
              if (img.complete) return res();
              img.addEventListener("load", res, { once: true });
              img.addEventListener("error", res, { once: true });
            });
          })
        );
      }

      async function initPartners() {
        // ✅ espera imagens (evita step=0 e “teleporte”/duplicação)
        await waitImages();

        calcStep();
        buildDots();

        // ✅ se por algum motivo step ficou 0, tenta mais 1 frame
        if (!step) {
          await new Promise((r) => requestAnimationFrame(r));
          calcStep();
        }

        setTransition(false);
        applyTransform();
        setActiveDot(0);
        isAnimating = false;
        startAuto();
      }

      initPartners();

      window.addEventListener("resize", () => {
        calcStep();
        setTransition(false);
        applyTransform();
        setActiveDot(getOriginalIndex());
      });
    }
  }
}
  // =========================
  // ✅ CONTADOR (HOME)
  // =========================
  const statsSection = document.querySelector(".stats");
  const numbers = document.querySelectorAll(".stat-number");

  if (statsSection && numbers.length) {
    let started = false;

    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;

            numbers.forEach((num) => {
              const target = Number(num.getAttribute("data-target")) || 0;
              let count = 0;

              const steps = 60;
              const increment = Math.max(1, Math.ceil(target / steps));

              const timer = setInterval(() => {
                count += increment;
                if (count >= target) {
                  num.textContent = String(target);
                  clearInterval(timer);
                } else {
                  num.textContent = String(count);
                }
              }, 20);
            });
          }
        });
      },
      { threshold: 0.4 }
    );

    statsObserver.observe(statsSection);
  }

  /* =========================================================
     ✅ ELETROMOBILIDADE (eletromobilidade.html)
  ========================================================= */

  // =========================
  // ✅ Carrossel HERO (Eletro)
  // =========================
  const eletroTrack = document.getElementById("eletroTrack");
  const eletroPrev = document.getElementById("eletroPrev");
  const eletroNext = document.getElementById("eletroNext");
  const eletroDots = document.getElementById("eletroDots");

  if (eletroTrack && eletroPrev && eletroNext && eletroDots) {
    const slides = Array.from(eletroTrack.children);
    const total = slides.length;

    if (total > 1) {
      let index = 0;
      let timer = null;

      function buildDots() {
        eletroDots.innerHTML = "";
        for (let i = 0; i < total; i++) {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "eletro-dot" + (i === 0 ? " active" : "");
          b.setAttribute("aria-label", `Ir para imagem ${i + 1}`);
          b.addEventListener("click", () => goTo(i));
          eletroDots.appendChild(b);
        }
      }

      function setActiveDot() {
        const dots = eletroDots.querySelectorAll(".eletro-dot");
        dots.forEach((d, i) => d.classList.toggle("active", i === index));
      }

      function goTo(i) {
        index = (i + total) % total;
        eletroTrack.style.transform = `translateX(-${index * 100}%)`;
        setActiveDot();
      }

      function startAuto() {
        stopAuto();
        timer = setInterval(() => goTo(index + 1), 5500);
      }

      function stopAuto() {
        if (timer) clearInterval(timer);
        timer = null;
      }

      eletroPrev.addEventListener("click", () => goTo(index - 1));
      eletroNext.addEventListener("click", () => goTo(index + 1));

      const wrap = document.querySelector(".eletro-carousel");
      if (wrap) {
        wrap.addEventListener("mouseenter", stopAuto);
        wrap.addEventListener("mouseleave", startAuto);
      }

      buildDots();
      goTo(0);
      startAuto();
    }
  }

  // =========================
  // ✅ Simulador EV (Eletro)
  // =========================
  const el = (id) => document.getElementById(id);

  const kmAno = el("kmAno");
  const kmLitro = el("kmLitro");
  const precoComb = el("precoComb");

  const kmKwh = el("kmKwh");
  const precoKwhCasa = el("precoKwhCasa");
  const pctCasa = el("pctCasa");
  const pctCasaLabel = el("pctCasaLabel");
  const precoKwhPublico = el("precoKwhPublico");

  const resCombAno = el("resCombAno");
  const resEleAno = el("resEleAno");
  const resEcoAno = el("resEcoAno");
  const resEcoMes = el("resEcoMes");

  const barComb = el("barComb");
  const barEle = el("barEle");

  const btnSimWhats = el("btnSimWhats");

  const hasEletroSim =
    kmAno && kmLitro && precoComb && kmKwh && precoKwhCasa && pctCasa && pctCasaLabel && precoKwhPublico &&
    resCombAno && resEleAno && resEcoAno && resEcoMes && barComb && barEle && btnSimWhats;

  if (hasEletroSim) {
    const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

    function clampNumber(v, min, max) {
      if (Number.isNaN(v)) return min;
      return Math.min(max, Math.max(min, v));
    }

    function calc() {
      const kmAnoVal = clampNumber(parseFloat(kmAno.value), 0, 1e9);

      const kmLitroVal = clampNumber(parseFloat(kmLitro.value), 1, 1e6);
      const precoCombVal = clampNumber(parseFloat(precoComb.value), 0, 1e6);

      const kmKwhVal = clampNumber(parseFloat(kmKwh.value), 1, 1e6);
      const precoCasaVal = clampNumber(parseFloat(precoKwhCasa.value), 0, 1e6);

      const pctCasaVal = clampNumber(parseFloat(pctCasa.value), 0, 100);
      const precoPublicoVal = clampNumber(parseFloat(precoKwhPublico.value), 0, 1e6);

      pctCasaLabel.textContent = String(Math.round(pctCasaVal));

      // Combustão
      const litrosAno = kmAnoVal / kmLitroVal;
      const custoCombAno = litrosAno * precoCombVal;

      // Elétrico
      const kwhAno = kmAnoVal / kmKwhVal;
      const fracCasa = pctCasaVal / 100;
      const fracPublico = 1 - fracCasa;

      const custoEleAno =
        (kwhAno * fracCasa * precoCasaVal) +
        (kwhAno * fracPublico * precoPublicoVal);

      const economiaAno = custoCombAno - custoEleAno;
      const economiaMes = economiaAno / 12;

      // UI
      resCombAno.textContent = brl.format(custoCombAno);
      resEleAno.textContent = brl.format(custoEleAno);
      resEcoAno.textContent = brl.format(economiaAno);
      resEcoMes.textContent = brl.format(economiaMes);

      // Barras
      const max = Math.max(custoCombAno, custoEleAno, 1);
      barComb.style.width = `${((custoCombAno / max) * 100).toFixed(1)}%`;
      barEle.style.width = `${((custoEleAno / max) * 100).toFixed(1)}%`;

      // WhatsApp msg (salva no dataset do botão)
      btnSimWhats.dataset.msg = [
        "Olá! Quero uma proposta técnica para carregador veicular (Esys).",
        "",
        "Simulação (estimativa):",
        `• KM/ano: ${kmAnoVal.toFixed(0)}`,
        `• Combustão: ${kmLitroVal} km/L | R$ ${precoCombVal.toFixed(2)}/L`,
        `• Elétrico: ${kmKwhVal} km/kWh | Casa R$ ${precoCasaVal.toFixed(2)}/kWh | Eletroposto R$ ${precoPublicoVal.toFixed(2)}/kWh`,
        `• % carga em casa: ${Math.round(pctCasaVal)}%`,
        "",
        `Custo anual (combustão): ${brl.format(custoCombAno)}`,
        `Custo anual (elétrico): ${brl.format(custoEleAno)}`,
        `Economia estimada: ${brl.format(economiaAno)} (≈ ${brl.format(economiaMes)}/mês)`,
        "",
        "Pode me orientar no dimensionamento (potência, proteções e infraestrutura)?"
      ].join("\n");
    }

    // presets km
    document.querySelectorAll(".sim-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        const v = parseFloat(btn.getAttribute("data-km"));
        if (!Number.isNaN(v)) {
          kmAno.value = String(v);
          calc();
        }
      });
    });

    // events
    [kmAno, kmLitro, precoComb, kmKwh, precoKwhCasa, pctCasa, precoKwhPublico].forEach((inp) => {
      inp.addEventListener("input", calc);
      inp.addEventListener("change", calc);
    });

    // CTA Whats
    btnSimWhats.addEventListener("click", () => {
      const mensagem = encodeURIComponent(
        btnSimWhats.dataset.msg || "Olá! Quero uma proposta técnica para carregador veicular."
      );
      const numero = WHATSAPP_NUMEROS.principal; // padrão: comercial
      window.open(`https://wa.me/${numero}?text=${mensagem}`, "_blank", "noopener");
    });

    calc();
  }

  // =========================
  // ✅ Combo Solar + Carregador (Eletro)
  // =========================
  const comboSim = document.getElementById("comboSolarSim");
  const comboNao = document.getElementById("comboSolarNao");
  const miniTitle = document.getElementById("comboMiniTitle");
  const miniText = document.getElementById("comboMiniText");
  const miniCTA = document.getElementById("comboMiniCTA");
  const comboCard = document.getElementById("comboCard");

  if (comboSim && comboNao && miniTitle && miniText && miniCTA) {
    const numero = WHATSAPP_NUMEROS.principal;

    const msgSim =
      "Olá! Já tenho energia solar e quero integrar um carregador veicular (wallbox) com projeto elétrico, proteções (DR/DPS), aterramento e dimensionamento para melhor aproveitamento da geração.";

    const msgNao =
      "Olá! Ainda não tenho energia solar, mas quero uma proposta integrada de PAINEL SOLAR + CARREGADOR VEICULAR, com dimensionamento técnico e infraestrutura elétrica (circuito dedicado, proteções, aterramento e comissionamento).";

    function setActive(which) {
      const isSim = which === "sim";

      comboSim.classList.toggle("active", isSim);
      comboNao.classList.toggle("active", !isSim);

      if (isSim) {
        miniTitle.textContent = "Cenário: já tenho solar";
        miniText.textContent =
          "Quero integrar wallbox ao meu sistema e maximizar o aproveitamento da geração.";
        miniCTA.textContent = "Quero integrar ao meu solar →";
        miniCTA.href = `https://wa.me/${principal}?text=${encodeURIComponent(msgSim)}`;
      } else {
        miniTitle.textContent = "Cenário: ainda não tenho solar";
        miniText.textContent =
          "Quero proposta completa do combo (solar + carregador) com projeto elétrico bem dimensionado.";
        miniCTA.textContent = "Quero proposta do combo →";
        miniCTA.href = `https://wa.me/${principal}?text=${encodeURIComponent(msgNao)}`;
      }

      if (comboCard) {
        comboCard.classList.remove("is-pulse");
        void comboCard.offsetWidth; // reflow
        comboCard.classList.add("is-pulse");
      }
    }

    comboSim.addEventListener("click", () => setActive("sim"));
    comboNao.addEventListener("click", () => setActive("nao"));

    setActive("sim");
  }

  /* =========================================================
     ✅ SMARTHOME (smarthome.html)
  ========================================================= */

  const smartVideo = document.getElementById("smartBgVideo");
  const smartBtnSound = document.getElementById("smartSoundToggle");

  if (smartVideo) {
    // garante autoplay (sem quebrar caso o browser bloqueie)
    smartVideo.muted = true;
    const playPromise = smartVideo.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  }

  if (smartVideo && smartBtnSound) {
    smartBtnSound.addEventListener("click", () => {
      const newMuted = !smartVideo.muted;
      smartVideo.muted = newMuted;
      smartBtnSound.textContent = newMuted ? "Som: OFF" : "Som: ON";
    });
  }
});
