// Smart Food Rescue Application Engine
document.addEventListener('DOMContentLoaded', () => {
  // Initialize state
  let state = {
    donations: JSON.parse(localStorage.getItem('sfr_donations')) || INITIAL_DONATIONS,
    needSpots: JSON.parse(localStorage.getItem('sfr_need_spots')) || INITIAL_FOOD_NEEDS,
    stats: JSON.parse(localStorage.getItem('sfr_stats')) || IMPACT_STATS,
    currentUser: JSON.parse(localStorage.getItem('sfr_user')) || DEMO_USERS[0], // Default: Elena Vance (Donor)
    activeView: 'landing', // 'landing', 'donor-dashboard', 'ngo-dashboard', 'need-reporter', 'impact'
    activeClaimItem: null
  };

  // DOM Elements
  const navItems = document.querySelectorAll('.nav-item');
  const viewContents = document.querySelectorAll('.view-content');
  const userProfileBtn = document.getElementById('userProfileBtn');
  const authModal = document.getElementById('authModal');
  const donorForm = document.getElementById('donorForm');
  const needForm = document.getElementById('needForm');
  const donorFeedGrid = document.getElementById('donorFeedGrid');
  const ngoFeedGrid = document.getElementById('ngoFeedGrid');
  const needSpotsGrid = document.getElementById('needSpotsGrid');
  const claimModal = document.getElementById('claimModal');
  const claimForm = document.getElementById('claimForm');

  // Helper: Save state
  function saveState() {
    localStorage.setItem('sfr_donations', JSON.stringify(state.donations));
    localStorage.setItem('sfr_need_spots', JSON.stringify(state.needSpots));
    localStorage.setItem('sfr_stats', JSON.stringify(state.stats));
    localStorage.setItem('sfr_user', JSON.stringify(state.currentUser));
  }

  // Toast Notification System
  window.showToast = function(message, icon = 'fa-circle-check') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid ${icon} toast-icon"></i> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  };

  // Render Logged-in User Profile in Header
  function renderUserProfile() {
    if (!userProfileBtn) return;
    const u = state.currentUser;
    userProfileBtn.innerHTML = `
      <img src="${u.avatar}" alt="${u.name}" class="user-avatar" />
      <div class="user-info-text">
        <span class="user-name-label">${u.name}</span>
        <span class="user-role-badge">${u.roleTitle}</span>
      </div>
      <i class="fa-solid fa-chevron-down" style="font-size: 0.75rem; color: var(--text-muted); margin-left: 0.2rem;"></i>
    `;
  }

  // View Navigation Router
  window.switchView = function(viewId) {
    state.activeView = viewId;
    
    navItems.forEach(item => {
      if (item.dataset.view === viewId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    viewContents.forEach(view => {
      if (view.id === `view-${viewId}`) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (viewId === 'donor-dashboard') renderDonorFeed();
    else if (viewId === 'ngo-dashboard') renderNgoFeed();
    else if (viewId === 'need-reporter') renderNeedSpots();
    else if (viewId === 'landing') renderStats();
  };

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      switchView(item.dataset.view);
    });
  });

  // Auth / Role Selection Modal
  if (userProfileBtn) {
    userProfileBtn.addEventListener('click', () => {
      if (authModal) authModal.classList.add('active');
    });
  }

  window.closeAuthModal = function() {
    if (authModal) authModal.classList.remove('active');
  };

  window.selectProfileRole = function(userId) {
    const selected = DEMO_USERS.find(u => u.id === userId);
    if (selected) {
      state.currentUser = selected;
      saveState();
      renderUserProfile();
      closeAuthModal();
      showToast(`Logged in as ${selected.name} (${selected.roleTitle})`, 'fa-user-check');

      if (selected.role === 'Donor') switchView('donor-dashboard');
      else if (selected.role === 'NGO') switchView('ngo-dashboard');
      else if (selected.role === 'Spotter') switchView('need-reporter');
    }
  };

  // Render Stats
  function renderStats() {
    const mealEl = document.getElementById('statMeals');
    const foodEl = document.getElementById('statFoodKg');
    const co2El = document.getElementById('statCo2');
    const donorEl = document.getElementById('statDonors');

    if (mealEl) mealEl.textContent = state.stats.totalMealsRescued.toLocaleString() + '+';
    if (foodEl) foodEl.textContent = state.stats.foodSavedKg.toLocaleString() + ' kg';
    if (co2El) co2El.textContent = state.stats.co2PreventedKg.toLocaleString() + ' kg';
    if (donorEl) donorEl.textContent = state.stats.activeDonors;
  }

  // Auto Impact Calculation on Donor Form
  const qtyInput = document.getElementById('donorQuantity');
  const impactText = document.getElementById('formImpactPreview');
  if (qtyInput && impactText) {
    qtyInput.addEventListener('input', () => {
      const val = parseInt(qtyInput.value) || 0;
      if (val > 0) {
        const estMeals = Math.round(val * 1.2);
        const estCo2 = (val * 1.5).toFixed(1);
        impactText.innerHTML = `🌟 <strong>Estimated Impact:</strong> Rescues approx. <strong>${estMeals} meals</strong> and prevents ~<strong>${estCo2} kg</strong> of CO2 emissions!`;
      } else {
        impactText.innerHTML = `✨ Enter quantity to preview estimated community impact.`;
      }
    });
  }

  // Handle Donor Form Submit
  if (donorForm) {
    donorForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = document.getElementById('donorTitle').value.trim();
      const category = document.getElementById('donorCategory').value;
      const quantityNumber = parseInt(document.getElementById('donorQuantity').value) || 10;
      const unit = document.getElementById('donorUnit').value;
      const expiryHours = parseFloat(document.getElementById('donorExpiry').value) || 4;
      const address = document.getElementById('donorAddress').value.trim();
      const contactPerson = document.getElementById('donorContactPerson').value.trim();
      const contactPhone = document.getElementById('donorContactPhone').value.trim();
      const storage = document.getElementById('donorStorage').value;
      const notes = document.getElementById('donorNotes').value.trim();

      const dietaryCheckboxes = document.querySelectorAll('input[name="dietary"]:checked');
      const dietary = Array.from(dietaryCheckboxes).map(cb => cb.value);

      const categoryImages = {
        "Prepared Meals": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
        "Bakery": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
        "Fresh Produce": "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80",
        "Dairy & Eggs": "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80",
        "Packaged Goods": "https://images.unsplash.com/photo-1584473457406-6df3a637210c?auto=format&fit=crop&w=600&q=80"
      };

      const newDonation = {
        id: `DON-${Math.floor(1000 + Math.random() * 9000)}`,
        title,
        category,
        donorName: state.currentUser.organization || "Surplus Donor",
        donorType: "Restaurant",
        quantity: `${quantityNumber} ${unit}`,
        quantityNumber,
        unit,
        weightKg: Math.round(quantityNumber * 0.4),
        expiryHours,
        expiryTime: new Date(Date.now() + expiryHours * 3600 * 1000).toISOString(),
        address,
        distance: "0.8 km",
        contactPerson,
        contactPhone,
        storage,
        dietary: dietary.length > 0 ? dietary : ["Vegetarian"],
        status: "Available",
        claimedBy: null,
        claimTime: null,
        pickupPin: null,
        image: categoryImages[category] || categoryImages["Prepared Meals"],
        notes: notes || "Fresh surplus prepared today."
      };

      state.donations.unshift(newDonation);
      state.stats.totalMealsRescued += quantityNumber;
      state.stats.foodSavedKg += Math.round(quantityNumber * 0.4);
      saveState();

      donorForm.reset();
      impactText.innerHTML = `✨ Enter quantity to preview estimated community impact.`;
      showToast(`Success! Donation "${title}" published.`, 'fa-circle-check');

      renderDonorFeed();
      renderStats();
      document.getElementById('donorListSection').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Render Donor Feed
  function renderDonorFeed(filterStatus = 'all') {
    if (!donorFeedGrid) return;
    donorFeedGrid.innerHTML = '';

    const filtered = state.donations.filter(item => {
      if (filterStatus === 'all') return true;
      return item.status.toLowerCase() === filterStatus.toLowerCase();
    });

    if (filtered.length === 0) {
      donorFeedGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: white; border-radius: var(--radius-lg); border: 1px dashed var(--border-light);">
          <i class="fa-solid fa-box-open" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
          <h4 style="font-size: 1.2rem; font-weight: 700; color: var(--text-muted);">No donations found</h4>
          <p style="color: var(--text-light);">Post your surplus food above to start reducing food waste.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'food-card';

      let statusBadgeClass = 'badge-available';
      if (item.status === 'Claimed') statusBadgeClass = 'badge-claimed';
      if (item.status === 'Completed') statusBadgeClass = 'badge-completed';

      const hoursLeft = Math.max(0, ((new Date(item.expiryTime) - new Date()) / 3600000)).toFixed(1);

      card.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="food-card-image" />
        <span class="card-badge-status ${statusBadgeClass}">${item.status}</span>
        <span class="card-expiry-badge"><i class="fa-regular fa-clock"></i> ${hoursLeft > 0 ? hoursLeft + ' hrs left' : 'Expired'}</span>

        <div class="card-body">
          <div class="card-category">${item.category}</div>
          <h3 class="card-title">${item.title}</h3>
          
          <div class="card-meta-list">
            <div class="meta-item">
              <span class="meta-label">Quantity:</span>
              <span class="meta-val">${item.quantity}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Storage:</span>
              <span class="meta-val">${item.storage}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Pickup Address:</span>
              <span class="meta-val" style="max-width: 160px; text-align: right; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${item.address}</span>
            </div>
          </div>

          ${item.status === 'Claimed' ? `
            <div style="background: var(--accent-amber-light); border: 1px solid var(--accent-amber); padding: 0.75rem; border-radius: var(--radius-md); margin-bottom: 1rem; font-size: 0.85rem;">
              <div style="font-weight: 800; color: #92400e;"><i class="fa-solid fa-handshake"></i> Claimed by: ${item.claimedBy}</div>
              <div style="margin-top: 0.25rem;">Pickup Security PIN: <strong style="font-family: monospace; font-size: 1rem; color: #78350f;">${item.pickupPin || '4921'}</strong></div>
            </div>
          ` : ''}

          <div class="dietary-tags">
            ${item.dietary.map(d => `<span class="dietary-tag">${d}</span>`).join('')}
          </div>

          <div class="card-footer">
            <span style="font-size: 0.8rem; color: var(--text-muted);">ID: ${item.id}</span>
            ${item.status === 'Available' ? `
              <button class="btn btn-outline-danger btn-sm" onclick="cancelDonation('${item.id}')"><i class="fa-solid fa-trash"></i> Cancel</button>
            ` : item.status === 'Claimed' ? `
              <button class="btn btn-primary btn-sm" onclick="completeDonation('${item.id}')"><i class="fa-solid fa-check-double"></i> Mark Handed Over</button>
            ` : `
              <span style="font-size: 0.85rem; font-weight: 700; color: var(--primary-700);"><i class="fa-solid fa-circle-check"></i> Completed</span>
            `}
          </div>
        </div>
      `;
      donorFeedGrid.appendChild(card);
    });
  }

  window.cancelDonation = function(id) {
    if (confirm("Are you sure you want to cancel this donation listing?")) {
      state.donations = state.donations.filter(d => d.id !== id);
      saveState();
      renderDonorFeed();
      showToast("Donation listing removed.", "fa-circle-exclamation");
    }
  };

  window.completeDonation = function(id) {
    const item = state.donations.find(d => d.id === id);
    if (item) {
      item.status = "Completed";
      saveState();
      renderDonorFeed();
      showToast(`Donation ${item.id} completed!`, "fa-circle-check");
    }
  };

  const donorFilterTabs = document.querySelectorAll('.donor-filter-tab');
  donorFilterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      donorFilterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderDonorFeed(tab.dataset.status);
    });
  });

  // Render NGO Feed
  function renderNgoFeed() {
    if (!ngoFeedGrid) return;
    ngoFeedGrid.innerHTML = '';

    const searchQuery = (document.getElementById('ngoSearchInput')?.value || '').toLowerCase();
    const categoryFilter = document.getElementById('ngoCategoryFilter')?.value || 'all';

    const availableDonations = state.donations.filter(item => {
      const matchSearch = item.title.toLowerCase().includes(searchQuery) ||
                          item.donorName.toLowerCase().includes(searchQuery) ||
                          item.address.toLowerCase().includes(searchQuery);
      const matchCategory = categoryFilter === 'all' || item.category === categoryFilter;
      return matchSearch && matchCategory;
    });

    if (availableDonations.length === 0) {
      ngoFeedGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3.5rem; background: white; border-radius: var(--radius-lg); border: 1px dashed var(--border-light);">
          <i class="fa-solid fa-utensils" style="font-size: 3.5rem; color: var(--text-light); margin-bottom: 1rem;"></i>
          <h4 style="font-size: 1.25rem; font-weight: 800; color: var(--text-muted);">No matching food donations available</h4>
        </div>
      `;
      return;
    }

    availableDonations.forEach(item => {
      const card = document.createElement('div');
      card.className = 'food-card';

      let statusBadgeClass = 'badge-available';
      if (item.status === 'Claimed') statusBadgeClass = 'badge-claimed';
      if (item.status === 'Completed') statusBadgeClass = 'badge-completed';

      const hoursLeft = Math.max(0, ((new Date(item.expiryTime) - new Date()) / 3600000)).toFixed(1);

      card.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="food-card-image" />
        <span class="card-badge-status ${statusBadgeClass}">${item.status}</span>
        <span class="card-expiry-badge"><i class="fa-regular fa-clock"></i> ${hoursLeft > 0 ? hoursLeft + ' hrs left' : 'Expired'}</span>

        <div class="card-body">
          <div class="card-category">${item.category}</div>
          <h3 class="card-title">${item.title}</h3>
          
          <div class="card-donor">
            <i class="fa-solid fa-store donor-verified"></i>
            <span>${item.donorName}</span>
            <span style="margin-left: auto; background: var(--primary-50); color: var(--primary-700); padding: 0.15rem 0.5rem; border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 700;">${item.distance}</span>
          </div>

          <div class="card-meta-list">
            <div class="meta-item">
              <span class="meta-label">Quantity:</span>
              <span class="meta-val">${item.quantity}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Storage Required:</span>
              <span class="meta-val">${item.storage}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Pickup Address:</span>
              <span class="meta-val" style="max-width: 170px; text-align: right; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${item.address}</span>
            </div>
          </div>

          <div class="dietary-tags">
            ${item.dietary.map(d => `<span class="dietary-tag">${d}</span>`).join('')}
          </div>

          <div class="card-footer">
            <span style="font-size: 0.8rem; color: var(--text-muted);"><i class="fa-solid fa-phone"></i> ${item.contactPhone}</span>
            ${item.status === 'Available' ? `
              <button class="btn btn-primary btn-sm" onclick="openClaimModal('${item.id}')"><i class="fa-solid fa-hand-holding-heart"></i> Claim Food</button>
            ` : `
              <span class="btn btn-secondary btn-sm" style="opacity: 0.7; cursor: not-allowed;"><i class="fa-solid fa-check"></i> ${item.status === 'Claimed' ? 'Claimed by ' + item.claimedBy : 'Completed'}</span>
            `}
          </div>
        </div>
      `;
      ngoFeedGrid.appendChild(card);
    });
  }

  const ngoSearchInput = document.getElementById('ngoSearchInput');
  const ngoCategoryFilter = document.getElementById('ngoCategoryFilter');
  if (ngoSearchInput) ngoSearchInput.addEventListener('input', renderNgoFeed);
  if (ngoCategoryFilter) ngoCategoryFilter.addEventListener('change', renderNgoFeed);

  // Claim Modal
  window.openClaimModal = function(donationId) {
    const item = state.donations.find(d => d.id === donationId);
    if (!item) return;

    state.activeClaimItem = item;
    document.getElementById('modalFoodTitle').textContent = item.title;
    document.getElementById('modalDonorName').textContent = item.donorName;
    document.getElementById('modalQuantity').textContent = item.quantity;
    document.getElementById('modalAddress').textContent = item.address;

    // Pre-fill user organization if NGO
    if (state.currentUser.role === 'NGO') {
      const orgSelect = document.getElementById('claimNgoName');
      if (orgSelect) orgSelect.value = state.currentUser.organization;
    }

    claimModal.classList.add('active');
  };

  window.closeClaimModal = function() {
    if (claimModal) claimModal.classList.remove('active');
    state.activeClaimItem = null;
  };

  if (claimForm) {
    claimForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!state.activeClaimItem) return;

      const ngoName = document.getElementById('claimNgoName').value;
      const beneficiaries = document.getElementById('claimBeneficiaries').value;
      const pickupTime = document.getElementById('claimPickupTime').value;

      const pin = Math.floor(1000 + Math.random() * 9000).toString();

      state.activeClaimItem.status = 'Claimed';
      state.activeClaimItem.claimedBy = ngoName;
      state.activeClaimItem.claimTime = new Date().toISOString();
      state.activeClaimItem.pickupPin = pin;

      saveState();

      const modalBody = document.getElementById('claimModalBody');
      modalBody.innerHTML = `
        <div style="text-align: center;">
          <div style="width: 60px; height: 60px; background: var(--primary-100); color: var(--primary-600); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 1.75rem;">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <h3 style="font-size: 1.4rem; font-weight: 800; color: var(--primary-900);">Food Claim Confirmed!</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">
            Thank you <strong>${ngoName}</strong> for rescuing food!
          </p>

          <div class="pickup-pass-box">
            <div style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">Digital Pickup Pass PIN</div>
            <div class="pickup-pin">${pin}</div>
            <div style="font-size: 0.85rem; opacity: 0.9;">Present this PIN to <strong>${state.activeClaimItem.donorName}</strong> upon pickup.</div>
          </div>

          <div style="margin-top: 1.5rem; text-align: left; background: #f8fafc; padding: 1rem; border-radius: var(--radius-md); font-size: 0.88rem;">
            <div>📍 <strong>Pickup Address:</strong> ${state.activeClaimItem.address}</div>
            <div>📞 <strong>Donor Contact:</strong> ${state.activeClaimItem.contactPerson} (${state.activeClaimItem.contactPhone})</div>
            <div>🕒 <strong>Estimated Pickup:</strong> ${pickupTime}</div>
          </div>

          <button class="btn btn-primary btn-lg" style="width: 100%; margin-top: 1.5rem;" onclick="closeModalAndReload()"><i class="fa-solid fa-check"></i> Done</button>
        </div>
      `;

      showToast(`Food successfully claimed! PIN: ${pin}`, 'fa-hand-holding-heart');
    });
  }

  window.closeModalAndReload = function() {
    closeClaimModal();
    location.reload();
  };

  // COMMUNITY FOOD NEED SPOTTER ENGINE
  if (needForm) {
    needForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = document.getElementById('needTitle').value.trim();
      const location = document.getElementById('needLocation').value.trim();
      const peopleCount = parseInt(document.getElementById('needPeopleCount').value) || 10;
      const urgency = document.getElementById('needUrgency').value;
      const category = document.getElementById('needCategory').value;
      const reporterName = document.getElementById('needReporterName').value.trim() || state.currentUser.name;
      const reporterContact = document.getElementById('needReporterContact').value.trim() || state.currentUser.phone;
      const notes = document.getElementById('needNotes').value.trim();

      const newNeed = {
        id: `NEED-${Math.floor(500 + Math.random() * 500)}`,
        title,
        location,
        peopleCount,
        urgency,
        category,
        reporterName,
        reporterContact,
        reportedTime: new Date().toISOString(),
        status: "Active Need",
        servicedBy: null,
        notes: notes || "Food needed urgently at this community spot."
      };

      state.needSpots.unshift(newNeed);
      saveState();

      needForm.reset();
      showToast(`Food need spot reported successfully!`, 'fa-location-dot');

      renderNeedSpots();
    });
  }

  // Render Need Spots Grid
  function renderNeedSpots() {
    if (!needSpotsGrid) return;
    needSpotsGrid.innerHTML = '';

    if (state.needSpots.length === 0) {
      needSpotsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: white; border-radius: var(--radius-lg); border: 1px dashed var(--border-light);">
          <i class="fa-solid fa-location-dot" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
          <h4 style="font-size: 1.2rem; font-weight: 700; color: var(--text-muted);">No active food need spots reported</h4>
        </div>
      `;
      return;
    }

    state.needSpots.forEach(spot => {
      const card = document.createElement('div');
      card.className = 'food-card';

      let urgencyBadgeStyle = 'background: #f59e0b; color: white;';
      if (spot.urgency === 'Emergency') urgencyBadgeStyle = 'background: #ef4444; color: white;';
      if (spot.urgency === 'Medium') urgencyBadgeStyle = 'background: #3b82f6; color: white;';

      let statusBadgeStyle = spot.status === 'Active Need' ? 'background: #ef4444; color: white;' : 'background: #10b981; color: white;';

      card.innerHTML = `
        <div style="padding: 1.25rem; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: white; display: flex; align-items: center; justify-content: space-between;">
          <span style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; ${statusBadgeStyle} padding: 0.25rem 0.65rem; border-radius: var(--radius-full);">${spot.status}</span>
          <span style="font-size: 0.8rem; font-weight: 700; ${urgencyBadgeStyle} padding: 0.25rem 0.65rem; border-radius: var(--radius-full);"><i class="fa-solid fa-triangle-exclamation"></i> ${spot.urgency} Urgency</span>
        </div>

        <div class="card-body">
          <div class="card-category" style="color: var(--accent-purple);">${spot.category}</div>
          <h3 class="card-title">${spot.title}</h3>
          
          <div class="card-meta-list">
            <div class="meta-item">
              <span class="meta-label">People in Need:</span>
              <span class="meta-val" style="color: var(--accent-red); font-size: 1rem;">~${spot.peopleCount} people</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Location:</span>
              <span class="meta-val" style="max-width: 170px; text-align: right; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">📍 ${spot.location}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Reported By:</span>
              <span class="meta-val">${spot.reporterName}</span>
            </div>
          </div>

          <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.25rem; background: #f8fafc; padding: 0.75rem; border-radius: var(--radius-md); border-left: 3px solid var(--accent-purple);">
            ${spot.notes}
          </p>

          <div class="card-footer">
            <span style="font-size: 0.8rem; color: var(--text-muted);"><i class="fa-solid fa-phone"></i> ${spot.reporterContact}</span>
            ${spot.status === 'Active Need' ? `
              <button class="btn btn-accent btn-sm" onclick="serviceNeedSpot('${spot.id}')"><i class="fa-solid fa-truck-fast"></i> Dispatch Food Here</button>
            ` : `
              <span style="font-size: 0.85rem; font-weight: 700; color: var(--primary-700);"><i class="fa-solid fa-circle-check"></i> Serviced by ${spot.servicedBy}</span>
            `}
          </div>
        </div>
      `;
      needSpotsGrid.appendChild(card);
    });
  }

  window.serviceNeedSpot = function(spotId) {
    const spot = state.needSpots.find(s => s.id === spotId);
    if (spot) {
      const org = state.currentUser.organization || "Community Rescue Team";
      spot.status = "Dispatched";
      spot.servicedBy = org;
      saveState();
      renderNeedSpots();
      showToast(`Dispatched food rescue team to ${spot.title}!`, 'fa-truck-fast');
    }
  };

  // Reset Mock Data
  window.resetMockData = function() {
    if (confirm("Reset all donations and food need spots to default demo data?")) {
      localStorage.removeItem('sfr_donations');
      localStorage.removeItem('sfr_need_spots');
      localStorage.removeItem('sfr_stats');
      localStorage.removeItem('sfr_user');
      state.donations = INITIAL_DONATIONS;
      state.needSpots = INITIAL_FOOD_NEEDS;
      state.stats = IMPACT_STATS;
      state.currentUser = DEMO_USERS[0];
      saveState();
      renderUserProfile();
      renderStats();
      renderDonorFeed();
      renderNgoFeed();
      renderNeedSpots();
      showToast("Data restored to demo state.", "fa-rotate");
    }
  };

  // Initial render
  renderUserProfile();
  renderStats();
  renderDonorFeed();
  renderNgoFeed();
  renderNeedSpots();
});
