import React, { useState, useEffect } from 'react'

import {
  auth,
  provider,
  onAuthStateChanged,
  signInWithPopup
} from './firebaseClient'

const deals = [
  {
    id: 1,
    name: 'Big Classic Stack',
    description: 'Two juicy beef patties, melted cheese, crisp lettuce and signature sauce in a toasted brioche-style bun.',
    price: 7.99,
    badge: 'Most loved',
    calories: 760,
    category: 'Burgers',
    intensity: 'Bold & savory',
    tag: 'Signature',
    image: '/images/big-classic-stack.jpg',
    orderUrl: 'https://www.mcdonalds.com/us/en-us/full-menu/burgers.html'
  },
  {
    id: 2,
    name: 'Crispy Chicken Royale',
    description: 'Golden chicken fillet with cool mayo, lettuce and a buttery bun for the perfect crunch.',
    price: 6.49,
    badge: 'Crispy pick',
    calories: 640,
    category: 'Chicken',
    intensity: 'Crisp & tender',
    tag: 'Limited time',
    image: '/images/crispy-chicken-royale.jpg',
    orderUrl:
      'https://www.mcdonalds.com/us/en-us/full-menu/chicken-and-fish-sandwiches.html'
  },
  {
    id: 3,
    name: 'Golden Fries Duo',
    description: 'Tactile, skin-on fries with a fluffy center. Shareable size with just the right amount of salt.',
    price: 3.49,
    badge: 'Perfect side',
    calories: 430,
    category: 'Sides',
    intensity: 'Light & crispy',
    tag: 'Share box',
    image: '/images/golden-fries-duo.jpg',
    orderUrl: 'https://www.mcdonalds.com/us/en-us/full-menu/fries-sides.html'
  },
  {
    id: 4,
    name: 'Spicy Fire Nuggets 10pc',
    description: 'Premium breading with a slow-building heat and a juicy bite in every piece.',
    price: 5.99,
    badge: 'Spicy',
    calories: 520,
    category: 'Chicken',
    intensity: 'Spicy & fun',
    tag: 'New',
    image: '/images/spicy-fire-nuggets.jpg',
    orderUrl:
      'https://www.mcdonalds.com/us/en-us/full-menu/mcnuggets-and-mccrispy-strips.html'
  },
  {
    id: 5,
    name: 'Creamy Caramel Frappe',
    description: 'Iced coffee blend with silky caramel ribbon and whipped topping.',
    price: 4.29,
    badge: 'Sweet break',
    calories: 380,
    category: 'Drinks',
    intensity: 'Cool & smooth',
    tag: 'Iced',
    image: '/images/creamy-caramel-frappe.jpg',
    orderUrl: 'https://www.mcdonalds.com/us/en-us/full-menu/mccafe-coffees.html'
  },
  {
    id: 6,
    name: 'Vanilla Soft Cone Duo',
    description: 'Soft-serve swirl in a crisp cone, smooth and airy with just enough sweetness.',
    price: 2.59,
    badge: 'Dessert duo',
    calories: 310,
    category: 'Desserts',
    intensity: 'Soft & creamy',
    tag: 'Classic',
    image: '/images/vanilla-soft-cone-duo.jpg',
    orderUrl: 'https://www.mcdonalds.com/us/en-us/full-menu/sweets-treats.html'
  }
]

const categories = ['Burgers', 'Chicken', 'Sides', 'Drinks', 'Desserts']

const bundles = [
  {
    id: 'classic-combo',
    name: 'Classic burger combo',
    description: 'Burger, fries and a cold drink in one tap.',
    itemIds: [1, 3, 5]
  },
  {
    id: 'spicy-night',
    name: 'Spicy night in',
    description: 'Spicy nuggets with fries and something cool.',
    itemIds: [4, 3, 5]
  },
  {
    id: 'sweet-break',
    name: 'Sweet break',
    description: 'A chilled drink and soft-serve dessert.',
    itemIds: [5, 6]
  }
]

const deliveryPartners = [
  {
    id: 'md',
    name: "McDonald's Official",
    tone: 'Order direct from the official website.',
    url: 'https://www.mcdonalds.com',
    accent: 'Direct partner'
  },
  {
    id: 'uber',
    name: 'Uber Eats',
    tone: 'Tap into speedy delivery and live order tracking.',
    url: 'https://www.ubereats.com',
    accent: 'Popular'
  },
  {
    id: 'dd',
    name: 'DoorDash',
    tone: 'Earn perks while you stack your cravings.',
    url: 'https://www.doordash.com',
    accent: 'Rewards'
  }
]

const faqs = [
  {
    q: 'Is this the official McDonald\'s website?',
    a: 'No. This is a themed affiliate-style experience built as a demo. You complete your order on trusted third-party partners or the official McDonald\'s website.'
  },
  {
    q: 'Where do I actually pay for my order?',
    a: 'When you tap a delivery partner or order button, you are redirected to that partner\'s website or app where checkout and payment happen securely.'
  },
  {
    q: 'Are prices exactly the same as in the restaurant?',
    a: 'Prices and availability can change based on location, delivery partner, and current promotions. Always check the final price on the partner site before ordering.'
  }
]

const affiliatePrimary = deliveryPartners[0]

function App() {
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)
  const [activeCategory, setActiveCategory] = useState('Burgers')
  const [selectedDeal, setSelectedDeal] = useState(deals[0])
  const [cart, setCart] = useState([])
  const [hasUserSelected, setHasUserSelected] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [activeDetail, setActiveDetail] = useState(null)

  const filteredDeals = deals.filter(d => d.category === activeCategory)

  function handleHover(deal) {
    setSelectedDeal(deal)
    setHasUserSelected(true)
  }

  function addToCart(deal) {
    setHasUserSelected(true)
    setCart(prev => {
      const existing = prev.find(item => item.id === deal.id)
      if (existing) {
        return prev.map(item =>
          item.id === deal.id ? { ...item, qty: item.qty + 1 } : item
        )
      }
      return [...prev, { ...deal, qty: 1 }]
    })
  }

  function isFavorite(id) {
    return favorites.includes(id)
  }

  function toggleFavorite(deal) {
    setFavorites(prev => {
      if (prev.includes(deal.id)) {
        return prev.filter(existingId => existingId !== deal.id)
      }
      return [...prev, deal.id]
    })
  }
  function openDetail(deal) {
    setActiveDetail(deal)
    setHasUserSelected(true)
  }

  function closeDetail() {
    setActiveDetail(null)
  }

  async function handleGoogleLogin() {
    try {
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error('Google login error', error)
      alert('Login failed. Please try again.')
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, firebaseUser => {
      setUser(firebaseUser)
      setAuthReady(true)
    })
    return () => unsubscribe()
  }, [])

  function cartTotal() {
    if (!cart.length) return '0.00'
    const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0)
    return total.toFixed(2)
  }

  function getTrayMood() {
    if (!cart.length) return 'Waiting for your first pick.'
    const totalCalories = cart.reduce(
      (sum, item) => sum + item.calories * item.qty,
      0
    )
    const hasSpicy = cart.some(
      item =>
        (item.badge && item.badge.toLowerCase().includes('spicy')) ||
        (item.intensity && item.intensity.toLowerCase().includes('spicy'))
    )
    if (hasSpicy) return 'Spicy and bold tonight.'
    if (totalCalories < 600) return 'Light snack mode.'
    if (totalCalories < 1200) return 'Balanced craving.'
    return 'Full feast energy.'
  }

  function getSmartSuggestion() {
    if (!deals.length) return []

    if (!cart.length) {
      const hero = selectedDeal
      const side = deals.find(d => d.category === 'Sides')
      const drink = deals.find(d => d.category === 'Drinks')
      const suggestions = []
      if (side && side.id !== hero.id) suggestions.push(side)
      if (drink && drink.id !== hero.id) suggestions.push(drink)
      return suggestions
    }

    const hasBurger = cart.some(item => item.category === 'Burgers')
    const hasSide = cart.some(item => item.category === 'Sides')
    const hasDrink = cart.some(item => item.category === 'Drinks')

    const suggestions = []

    if (hasBurger && !hasSide) {
      const side = deals.find(d => d.category === 'Sides')
      if (side) suggestions.push(side)
    }

    if ((hasBurger || hasSide) && !hasDrink) {
      const drink = deals.find(d => d.category === 'Drinks')
      if (drink && !suggestions.find(s => s.id === drink.id)) {
        suggestions.push(drink)
      }
    }

    return suggestions
  }

  function getEtaLabel() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0)
    if (!totalItems) {
      return 'ETA appears once you add something to your tray.'
    }
    if (totalItems <= 2) return 'Estimated arrival in about 15–20 minutes.'
    if (totalItems <= 5) return 'Estimated arrival in about 20–30 minutes.'
    return 'Estimated arrival in about 30–40 minutes.'
  }

  function applyBundle(bundle) {
    const bundleItems =
      bundle.itemIds
        .map(id => deals.find(d => d.id === id))
        .filter(Boolean)
        .map(deal => ({ ...deal, qty: 1 }))
    if (!bundleItems.length) return
    setCart(bundleItems)
    setHasUserSelected(true)
  }

  function openAffiliate(url) {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  useEffect(() => {
    if (hasUserSelected) return
    const now = new Date()
    const hour = now.getHours()
    let preferredCategory = 'Burgers'
    if (hour < 11) preferredCategory = 'Drinks'
    else if (hour < 15) preferredCategory = 'Burgers'
    else if (hour < 21) preferredCategory = 'Chicken'
    else preferredCategory = 'Sides'
    const candidate =
      deals.find(d => d.category === preferredCategory) || deals[0]
    if (candidate) {
      setActiveCategory(candidate.category)
      setSelectedDeal(candidate)
    }
  }, [hasUserSelected])

  useEffect(() => {
    if (hasUserSelected) return
    const interval = setInterval(() => {
      setSelectedDeal(prev => {
        const group = deals.filter(d => d.category === activeCategory)
        const list = group.length ? group : deals
        if (!list.length) return prev
        const currentIndex = list.findIndex(d => d.id === (prev && prev.id))
        const nextIndex =
          currentIndex === -1 ? 0 : (currentIndex + 1) % list.length
        return list[nextIndex]
      })
    }, 12000)
    return () => clearInterval(interval)
  }, [activeCategory, hasUserSelected])

  const smartSuggestions = getSmartSuggestion()

  if (!authReady) {
    return (
      <div className="auth-gate-root">
        <div className="auth-card auth-card-loading">
          <div className="auth-title">McGold Affiliation Hub</div>
          <div className="auth-sub">Warming up your McMoment...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="auth-gate-root">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="brand-arches">
              <span />
              <span />
            </div>
            <div className="auth-logo-copy">
              <div className="auth-title">McGold Affiliation Hub</div>
              <div className="auth-sub">
                Sign in to unlock your curated McDonald&apos;s inspired menu.
              </div>
            </div>
          </div>
          <button
            type="button"
            className="auth-google"
            onClick={handleGoogleLogin}
          >
            <span className="auth-google-icon">G</span>
            <span className="auth-google-label">Continue with Google</span>
          </button>
          <div className="auth-footnote">
            We only use your Google account to personalize this experience.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-root">
      <header className="top-nav">
        <div className="top-nav-inner">
          <div className="brand-mark">
            <div className="brand-arches">
              <span />
              <span />
            </div>
            <div className="brand-lockup">
              <div className="brand-title">McGold Affiliation Hub</div>
              <div className="brand-sub">Curated McDonald&apos;s inspired cravings</div>
            </div>
          </div>
          <nav className="top-links">
            <a href="#deals">Featured</a>
            <a href="#menu">Menu</a>
            <a href="#how">How it works</a>
            <a href="#faq">FAQ</a>
          </nav>
          <button
            className="primary-chip"
            onClick={() => openAffiliate(affiliatePrimary.url)}
          >
            Start order
          </button>
        </div>
      </header>

      <main className="page-shell">
        <section className="hero" id="deals">
          <div className="hero-left">
            <div className="hero-kicker">Tonight&apos;s McMoment</div>
            <h1 className="hero-title">Build a McDonald&apos;s order that feels premium and tactile.</h1>
            <p className="hero-sub">
              Swipe through bold burgers, crispy chicken and golden fries, then jump straight into checkout with trusted delivery partners.
            </p>

            <div className="hero-actions">
              <button
                className="hero-cta"
                onClick={() =>
                  openAffiliate(
                    (selectedDeal && selectedDeal.orderUrl) || affiliatePrimary.url
                  )
                }
              >
                Order via {affiliatePrimary.name}
              </button>
              <button
                className="hero-ghost"
                onClick={() => {
                  const element = document.getElementById('menu')
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
              >
                Browse menu first
              </button>
            </div>

            <div className="hero-meta">
              <div>
                <div className="hero-meta-label">Curated bundles</div>
                <div className="hero-meta-value">6 premium picks</div>
              </div>
              <div>
                <div className="hero-meta-label">Delivery partners</div>
                <div className="hero-meta-value">{deliveryPartners.length} integrated</div>
              </div>
              <div>
                <div className="hero-meta-label">Tactile UI</div>
                <div className="hero-meta-value">Soft cards, real-time feel</div>
              </div>
            </div>

            {smartSuggestions.length > 0 && (
              <div className="hero-smart">
                <div className="hero-smart-label">Smart pairing</div>
                <div className="hero-smart-chips">
                  {smartSuggestions.map(item => (
                    <button
                      key={item.id}
                      className="smart-chip"
                      onClick={() => addToCart(item)}
                    >
                      <span className="smart-chip-name">{item.name}</span>
                      <span className="smart-chip-meta">
                        ${item.price.toFixed(2)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="hero-right">
            <div className="hero-plate">
              <div className="plate-top">
                <div className="plate-tag-row">
                  <span className="pill pill-hot">Hot off the grill</span>
                  <span className="pill pill-soft">Tap to feel</span>
                </div>
                <div className="plate-main">
                  <div className="plate-photo-shell">
                    <div className="plate-photo-glow" />
                    <img
                      src={selectedDeal.image}
                      alt={selectedDeal.name}
                      className="plate-photo-img"
                      loading="lazy"
                    />
                  </div>
                  <div className="plate-copy">
                    <div className="plate-label">Tonight&apos;s stack</div>
                    <div className="plate-name">{selectedDeal.name}</div>
                    <div className="plate-desc">{selectedDeal.description}</div>
                    <div className="plate-metrics">
                      <span>{selectedDeal.intensity}</span>
                      <span>{selectedDeal.calories} kcal</span>
                      <span className="plate-badge">{selectedDeal.badge}</span>
                    </div>
                    <div className="plate-footer">
                      <span className="plate-price">${selectedDeal.price.toFixed(2)}</span>
                      <button
                        className="plate-cta"
                        onClick={() => addToCart(selectedDeal)}
                      >
                        Add to tray
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="plate-bottom">
                {deliveryPartners.map(partner => (
                  <button
                    key={partner.id}
                    className="partner-pill"
                    onClick={() => openAffiliate(partner.url)}
                  >
                    <span className="partner-dot" />
                    <span className="partner-main">{partner.name}</span>
                    <span className="partner-sub">{partner.tone}</span>
                    <span className="partner-accent">{partner.accent}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className="menu-section" id="menu">
          <div className="menu-header-row">
            <div>
              <h2 className="section-title">Menu, but more tactile.</h2>
              <p className="section-sub">
                Tap through categories to feel how each card lifts, glows and responds. Every selection is one step closer to the real order.
              </p>
            </div>
            <div className="category-tabs" role="tablist">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={[
                    'category-tab',
                    activeCategory === cat ? 'category-tab-active' : ''
                  ].join(' ')}
                  onClick={() => setActiveCategory(cat)}
                  role="tab"
                  aria-selected={activeCategory === cat}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="menu-grid">
            {filteredDeals.map(deal => (
              <article
                key={deal.id}
                className="menu-card"
                onMouseEnter={() => handleHover(deal)}
                onClick={() => openDetail(deal)}
              >
                <div className="menu-card-top">
                  <div className="menu-photo-shell">
                    <div className="menu-photo-glow" />
                    <img
                      src={deal.image}
                      alt={deal.name}
                      className="menu-photo-img"
                      loading="lazy"
                    />
                    <span className="menu-photo-tag">{deal.tag}</span>
                  </div>
                  <div className="menu-chip-row">
                    <button
                      type="button"
                      className={[
                        'card-favorite',
                        isFavorite(deal.id) ? 'card-favorite-active' : ''
                      ].join(' ')}
                      onClick={event => {
                        event.stopPropagation()
                        toggleFavorite(deal)
                      }}
                    >
                      <span className="card-favorite-dot" />
                    </button>
                    <span className="menu-chip">{deal.badge}</span>
                    <span className="menu-chip soft">{deal.intensity}</span>
                  </div>
                </div>
                <div className="menu-card-body">
                  <h3 className="menu-card-title">{deal.name}</h3>
                  <p className="menu-card-desc">{deal.description}</p>
                </div>
                <div className="menu-card-footer">
                  <div className="menu-price-row">
                    <span className="menu-price">${deal.price.toFixed(2)}</span>
                    <span className="menu-calories">{deal.calories} kcal</span>
                  </div>
                  <div className="menu-actions">
                    <button
                      className="menu-secondary"
                      onClick={event => {
                        event.stopPropagation()
                        openDetail(deal)
                      }}
                    >
                      View deal
                    </button>
                    <button
                      className="menu-primary"
                      onClick={() => addToCart(deal)}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="how-section" id="how">
          <div className="how-shell">
            <div className="how-header">
              <h2 className="section-title">How the affiliation flow works.</h2>
              <p className="section-sub">
                This experience lets you feel the McDonald&apos;s ordering moment, then hands off to partners you already trust to complete your purchase.
              </p>
            </div>
            <div className="how-grid">
              <div className="how-step">
                <div className="how-step-index">1</div>
                <h3 className="how-step-title">Curate your cravings</h3>
                <p className="how-step-desc">
                  Explore the interactive cards, switch categories, and add items to your tray just like you would in an app.
                </p>
              </div>
              <div className="how-step">
                <div className="how-step-index">2</div>
                <h3 className="how-step-title">Choose a partner</h3>
                <p className="how-step-desc">
                  Pick from official or major delivery partners. When you tap, you are redirected to their website or app.
                </p>
              </div>
              <div className="how-step">
                <div className="how-step-index">3</div>
                <h3 className="how-step-title">Complete checkout securely</h3>
                <p className="how-step-desc">
                  Confirm the final items and pricing on the partner side, then place your order with their secure payment flow.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="faq-section" id="faq">
          <div className="faq-shell">
            <div className="faq-header">
              <h2 className="section-title">Questions before you tap order?</h2>
              <p className="section-sub">
                A quick overview of what this affiliation-style experience is and how it connects you with real McDonald&apos;s orders.
              </p>
            </div>
            <div className="faq-grid">
              {faqs.map(item => (
                <article key={item.q} className="faq-card">
                  <h3 className="faq-question">{item.q}</h3>
                  <p className="faq-answer">{item.a}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <aside className="cart-shell">
        <div className="cart-header">
          <div>
            <div className="cart-title">Your tray</div>
            <div className="cart-sub">Preview of what you are craving tonight.</div>
            <div className="cart-mood">{getTrayMood()}</div>
          </div>
          <span className="cart-pill">{cart.length} item{cart.length === 1 ? '' : 's'}</span>
        </div>
        <div className="cart-body">
          {cart.length === 0 && (
            <div className="cart-empty">
              <div className="cart-empty-icon" />
              <div className="cart-empty-title">Nothing in your tray yet.</div>
              <div className="cart-empty-sub">Add a burger, fries or dessert to feel the handoff flow.</div>
              <div className="cart-bundles">
                {bundles.map(bundle => (
                  <button
                    key={bundle.id}
                    type="button"
                    className="cart-bundle-chip"
                    onClick={() => applyBundle(bundle)}
                  >
                    <span className="cart-bundle-name">{bundle.name}</span>
                    <span className="cart-bundle-meta">{bundle.description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {cart.length > 0 && (
            <ul className="cart-list">
              {cart.map(item => (
                <li key={item.id} className="cart-row">
                  <div className="cart-row-main">
                    <div className="cart-row-title">{item.name}</div>
                    <div className="cart-row-meta">
                      <span>x{item.qty}</span>
                      <span>{item.calories} kcal</span>
                    </div>
                  </div>
                  <div className="cart-row-price">${(item.qty * item.price).toFixed(2)}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="cart-footer">
          <div className="cart-total-row">
            <span>Total preview</span>
            <span className="cart-total">${cartTotal()}</span>
          </div>
          <div className="cart-eta">{getEtaLabel()}</div>
          <button
            className="cart-cta"
            onClick={() => openAffiliate(affiliatePrimary.url)}
            disabled={!cart.length}
          >
            Continue on {affiliatePrimary.name}
          </button>
          <div className="cart-caption">
            Final pricing, taxes and fees are confirmed on the partner checkout page.
          </div>
        </div>
      </aside>

      {activeDetail && (
        <>
          <div className="detail-backdrop" onClick={closeDetail} />
          <div className="detail-panel" role="dialog" aria-modal="true">
            <div className="detail-panel-inner">
              <div className="detail-header">
                <div className="detail-kicker">Item details</div>
                <button
                  type="button"
                  className="detail-close"
                  onClick={closeDetail}
                >
                  Close
                </button>
              </div>
              <div className="detail-main">
                <div className="detail-photo-shell">
                  <img
                    src={activeDetail.image}
                    alt={activeDetail.name}
                    className="detail-photo-img"
                  />
                </div>
                <div className="detail-copy">
                  <h2 className="detail-title">{activeDetail.name}</h2>
                  <p className="detail-desc">{activeDetail.description}</p>
                  <div className="detail-meta-row">
                    <span className="detail-price">
                      ${activeDetail.price.toFixed(2)}
                    </span>
                    <span className="detail-calories">
                      {activeDetail.calories} kcal
                    </span>
                    <span className="detail-tag">{activeDetail.tag}</span>
                  </div>
                </div>
              </div>
              <div className="detail-footer">
                <button
                  type="button"
                  className="detail-primary"
                  onClick={() => addToCart(activeDetail)}
                >
                  Add to tray
                </button>
                <button
                  type="button"
                  className="detail-secondary"
                  onClick={() =>
                    openAffiliate(
                      (activeDetail && activeDetail.orderUrl) ||
                        affiliatePrimary.url
                    )
                  }
                >
                  Order via {affiliatePrimary.name}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <footer className="page-footer">
        <div className="footer-inner">
          <div className="footer-brand">McGold Affiliation Hub</div>
          <p className="footer-text">
            This is an independent, McDonald&apos;s inspired demo experience built for showcasing a premium, tactile affiliate-style interface. It is not endorsed by or officially connected to McDonald&apos;s Corporation.
          </p>
          <p className="footer-text subtle">
            All logos, menu names and related marks remain trademarks of their respective owners. Always review the final order summary and pricing on the official partner site before paying.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
