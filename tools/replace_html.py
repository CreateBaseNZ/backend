import os, fnmatch, re
from bs4 import BeautifulSoup, Tag

test = True

my_document = """
  <pre>
  <nav>
    <div class="nav-darken-overlay"></div>
    <div class="nav-top-bar">
      <button class="hamburger hamburger-spin" type="button">
        <span class="hamburger-box">
          <span class="hamburger-inner"></span>
        </span>
      </button>
      <a href="/" class="nav-home-btn">
        <img src="./../../public/images/logo-icon.png" class="nav-logo" alt="CreateBase" />
      </a>
      <div class="nav-user-icon">
        <img src="./../../public/images/user-out-highlight.png" class="nav-user-hlt" alt="User" />
        <img src="/profile/customer/fetch/picture" id="nav-user-reg" alt="User" />
        <img src="./../../public/images/user-out.png" id="nav-user-out" alt="User" />
        <img src="./../../public/images/user-x.png" id="nav-user-x" alt="User" />
      </div>
      <div class="nav-user-button">
        <a href="/login" id="nav-user-login">LOG IN</a>
        <a href="/signup" id="nav-user-signup">SIGN UP</a>
      </div>
    </div>
    <div class="nav-side-menus">
      <div class="nav-left-menu-wrap">
        <div class="nav-left-menu">
          <div class="nav-side-menu-links">
            <p class="nav-side-header">SERVICES</p>
            <span class="nav-item-outer">
              <a href="/3d-printing" class="nav-item-inner">3D PRINTING</a>
              <a href="/services/3d-printing" class="info">i</a>
            </span>
            <span class="nav-item-outer">
              <a href="/services/marketplace" class="nav-item-inner">MARKETPLACE</a>
              <a href="/services/marketplace" class="info">i</a>
            </span>
            <div class="nav-sep"></div>
            <p class="nav-side-header">PRODUCTS</p>
            <span class="nav-item-outer">
              <a href="/products/engkits" class="nav-item-inner">ENGINEERING KITS</a>
              <a href="/products/engkits" class="info">i</a>
            </span>
            <div class="nav-sep"></div>
            <p class="nav-side-header">CREATEBASE</p>
            <a href="/story" class="nav-side-item">OUR STORY</a>
            <a href="/team" class="nav-side-item">OUR TEAM</a>
          </div>
          <div class="nav-side-socials">
            <a href="https://www.facebook.com/" class="fab fa-facebook-square" target="_blank"></a>
            <a href="https://www.instagram.com/" class="fab fa-instagram" target="_blank"></a>
            <a href="https://twitter.com/" class="fab fa-twitter" target="_blank"></a>
            <a href="https://www.youtube.com/user/LouiiL" class="fab fa-youtube" target="_blank"></a>
          </div>
        </div>
      </div>
      <div class="nav-right-menu-out">
        <div class="nav-right-menu">
          <p class="nav-side-header">WELCOME BACK</p>
          <a href="/login" class="nav-side-item">LOG IN</a>
          <div class="nav-sep"></div>
          <p class="nav-side-header">FIRST TIME?</p>
          <a href="/signup" class="nav-side-item">SIGN UP</a>
        </div>
      </div>
      <div class="nav-right-menu-in">
        <div class="nav-right-menu">
          <img src="/profile/customer/fetch/picture" id="nav-dp"></img>
          <p class="nav-side-header">PROJECTS</p>
          <a href="/profile" class="nav-side-item" data-tab="projects" onclick="passTab(this);">MY PROJECTS</a>
          <div class="nav-sep"></div>
          <p class="nav-side-header">ACCOUNT</p>
          <a href="/profile" class="nav-side-item" data-tab="projects" onclick="passTab(this);">MY PROFILE</a>
          <a href="/profile" class="nav-side-item" data-tab="settings" onclick="passTab(this);">SETTINGS</a>
          <a href="/profile" class="nav-side-item" data-tab="billing" onclick="passTab(this);">BILLING</a>
          <a href="/logout" class="nav-side-signout">SIGN OUT</a>
        </div>
      </div>
    </div>
  </nav>
  </pre>
"""

soup = BeautifulSoup(my_document, "html.parser")
newHTML = str(soup.encode(formatter=None).decode())

directory = "C:/Users/lollo/Documents/CreateBase/website/views/public"

for path, dirs, files in os.walk(os.path.abspath(directory)):
  for filename in fnmatch.filter(files, "*.html"):
    filepath = os.path.join(path, filename)
    with open(filepath) as target_file:
      editting = target_file.read()
    editting = re.sub('<nav>(.|\n)*?<\/nav>\n', newHTML, editting, count=1)
    editting = re.sub('\(\);">(.|\n)*?<pre>', '();">\n', editting)
    editting = re.sub('</pre>(.|\n)*?<div', '\n\t<div', editting)
    with open(filepath, "w") as file:
      file.write(editting)

