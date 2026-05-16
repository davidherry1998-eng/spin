const button = document.querySelector('.cta-btn');

button.addEventListener('click', () => {
  console.log('Telegram CTA clicked');

  // Meta Pixel event
  if (typeof fbq === 'function') {
    fbq('track', 'Lead');
  }

  // Google Analytics event
  if (typeof gtag === 'function') {
    gtag('event', 'telegram_join_click', {
      event_category: 'CTA',
      event_label: 'Patron Club Telegram'
    });
  }
});
