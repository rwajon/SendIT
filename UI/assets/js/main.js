const PAGE_PARTS = [];

async function getData(URL, resType = 'text', token = '') {
  try {
    const request = new Request(URL, {
      method: 'GET',
      mode: 'cors',
      cache: 'reload',
      credentials: 'include',
      headers: {
        'x-access-token': token
      }
    });

    let data = '';
    const response = await fetch(request);

    if (response.ok) {
      if (resType === 'json') {
        data = await response.json();
        return data;
      } else {
        data = await response.text();
        return data;
      }
    } else {
      throw Error(response.statusText);
    }
  } catch (e) {
    throw Error(e);
  }

}

function menuAsideToggle(el) {
  const menuAside = document.getElementById('user-menu-aside') || document.getElementById('admin-menu-aside');

  if (window.outerWidth < 768) {
    menuAside.style.display = menuAside.style.display === 'none' ? 'block' : 'none';
  }

  document.getElementById('section').addEventListener('click', () => { menuAside.style.display = 'none' });
}

function showIncludedParts() {
  if (PAGE_PARTS.length === 4) {
    const header = document.getElementById('header') || null;
    const nav = document.getElementById('nav') || null;
    const menuAside = document.getElementById('user-menu-aside') || document.getElementById('admin-menu-aside') || null;
    const section = document.getElementById('section') || null;
    const footer = document.getElementById('footer') || null;

    // header
    if (header) {
      header.style.position = 'fixed';
      header.style.top = '0';
      header.style.display = 'block';
    }

    // nav
    if (nav) {
      nav.style.position = 'fixed';
      nav.style.top = `${header.offsetHeight}px`;
      nav.style.display = window.outerWidth < 768 ? 'block' : '';
    }

    // menu-aside
    if (menuAside) {
      menuAside.style.position = 'fixed';
      menuAside.style.top = `${header.outerHeight + nav.outerHeight}px`
      menuAside.style.minHeight = `${window.innerHeight}px`;
      menuAside.style.display = window.outerWidth > 768 ? 'block' : 'none';
    }

    // section
    if (section) {
      if (nav) {
        section.style.minHeight = `${window.innerHeight - ((header.offsetHeight + nav.offsetHeight) * 2)}px`;
      } else {
        section.style.minHeight = `${window.innerHeight - (header.offsetHeight * 3)}px`;
      }

      section.style.marginLeft = (nav && window.outerWidth > 768) ? `${menuAside.offsetWidth}px` : 0;
      section.style.marginTop = nav ? `${header.offsetHeight + nav.offsetHeight}px` : `${header.offsetHeight}px`;
      section.style.display = 'block';
    }

    // footer
    if (footer) {
      footer.style.marginLeft = (nav && window.outerWidth > 768) ? `${menuAside.offsetWidth}px` : 0;
      footer.style.display = 'block';
    }
  }
}

function loadPagePartEnd(part) {
  if (part) { PAGE_PARTS.push(part); }
  showIncludedParts();
  window.addEventListener("resize", showIncludedParts);
}

async function loadHeader() {
  let header = document.getElementById('header');
  let result = await getData('includes/header.html', 'text');

  if (result) {
    loadPagePartEnd('header');
    if (header) {
      header.innerHTML = result;
    }
  }
}

async function loadNav() {
  let nav = document.getElementById('nav');
  let result = await getData('includes/nav.html', 'text');

  if (result) {
    loadPagePartEnd('nav');
    if (nav) {
      nav.innerHTML = result;
    }
  }
}

async function loadMenuAside() {
  let userMenuAside = document.getElementById('user-menu-aside') || null;
  let adminMenuAside = document.getElementById('admin-menu-aside') || null;
  let resultUser = await getData('includes/user_menu_aside.html', 'text');
  let resultAdmin = await getData('includes/admin_menu_aside.html', 'text');

  if (resultUser || resultAdmin) {
    loadPagePartEnd('menuAside');

    if (userMenuAside) {
      userMenuAside.innerHTML = resultUser;
    } else if (adminMenuAside) {
      adminMenuAside.innerHTML = resultAdmin;
    }
  }
}

async function loadFooter() {
  let footer = document.getElementById('footer');
  let result = await getData('includes/footer.html', 'text');

  if (result) {
    loadPagePartEnd('footer');
    if (footer) {
      footer.innerHTML = result;
    }
  }
}

// main()
window.document.addEventListener('DOMContentLoaded', function main() {
  loadHeader();
  loadNav();
  loadMenuAside();
  loadFooter();
});