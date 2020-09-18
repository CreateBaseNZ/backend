import os, fnmatch, re
from bs4 import BeautifulSoup, Tag

markdown = """
<pre>
  <nav class="hide">

    <div class="nav-darken-overlay" onclick="navigation.exitModal();"></div>

    <div class="nav-top-bar">
      <!-- <div class="nav-desktop-out">
        <a href="/login" id="nav-user-login">LOG IN</a>
        <a class="grad-btn" href="/signup" id="nav-user-signup">SIGN UP</a>
      </div> -->
      <a class="nav-home-btn" href="/">
        <img class="nav-logo mobile" src="/public/images/logo-icon.png" alt="CreateBase">
        <img class="nav-logo desktop" src="/public/images/logo-dark.png" alt="CreateBase">
      </a>
      <button class="hamburger hamburger-spin" onclick="navigation.toggleRightMenu();" type="button">
        <span class="hamburger-box">
          <span class="hamburger-inner"></span>
        </span>
      </button>
      <div class="nav-top-desktop">
        <a id="nav-top-story" class="nav-top-item" href="/story">Our story</a>
        <a id="nav-top-team" class="nav-top-item" href="/team">The team</a>
        <a id="nav-top-3d-printing" class="nav-top-item" href="/services/3d-printing">3D printing</a>
        <a id="nav-top-kits" class="nav-top-item" href="/products/kits">Steam kits</a>
        <a id="nav-top-contact" class="nav-top-item" href="/contact">Contact us</a>
        <a id="nav-top-subscribe" class="nav-top-item" href="/products/kits">Touch base</a>
      </div>
    </div>
    <div class="nav-side-menu-wrapper">
      <div class="nav-side-menu-container">
        <div class="nav-side-menu-half left">
          <p class="nav-side-header logged-out">WELCOME BACK</p>
          <a class="nav-side-item logged-out" href="/login">LOG IN</a>
          <p class="nav-side-header logged-out">FIRST TIME?</p>
          <a class="nav-side-item logged-out" href="/signup">SIGN UP</a>
          <p class="nav-side-header logged-in">Hello, Louis</p>
          <a class="nav-side-item logged-in" href="/profile">DASHBOARD</a>
          <a class="nav-side-item logged-in" href="/profile/projects">MY PROJECTS</a>
          <a class="nav-side-item logged-in" href="/profile/orders">MY ORDERS</a>
          <a class="nav-side-item logged-in" href="/profile/settings">SETTINGS</a>
          <a id="nav-signout" class="nav-side-item logged-in" href="/logout">SIGN OUT</a>
        </div>
        <div class="nav-side-menu-half right">
          <!-- <p class="nav-side-header">CREATEBASE</p>
          <a class="nav-side-item" href="/make">MAKE</a>
          <a class="nav-side-item" href="/products/kits">KITS</a>
          <a class="nav-side-item" href="/services/marketplace">SHOP</a> -->
          <p class="nav-side-header">INFO</p>
          <a class="nav-side-item" href="/services/3d-printing">3D PRINTING</a>
          <a class="nav-side-item" href="/products/kits">STEAM KITS</a>
          <!-- <a class="nav-side-item" href="/services/marketplace">MARKETPLACE</a> -->
          <!-- <a class="nav-side-item" href="/faq">FAQ</a> -->
          <p class="nav-side-header">ABOUT</p>
          <a class="nav-side-item" href="/story">OUR STORY</a>
          <a class="nav-side-item" href="/team">THE TEAM</a>
          <a class="nav-side-item" href="/contact">CONTACT US</a>
          <a class="nav-side-item" href="/products/kits">TOUCH BASE</a>
          <div class="nav-socials">
            <a class="fab fa-facebook-square" href="https://www.facebook.com/CreateBase-110365053954978/?view_public_for=110365053954978" target="_blank"></a>
            <a class="fab fa-instagram" href="https://www.instagram.com/createbasenz/" target="_blank"></a>
            <a class="fab fa-twitter" href="https://twitter.com/CreateBaseNZ" target="_blank"></a>
            <a class="fab fa-youtube" href="https://www.youtube.com/channel/UClLBwFvHpGrRpxyRg1IOB0g/featured?view_as=subscriber" target="_blank"></a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</pre>

"""

def execute(exclude):
  # Turns markdown into string with formatting
  soup = BeautifulSoup(markdown, "html.parser")
  newHTML = str(soup.encode('ascii').decode())

  # Set the directory (relative to cwd) here
  directory = "../views/"

  # Iterate through every html file
  for path, dirs, files in os.walk(os.path.join(os.path.dirname( __file__ ), directory)):
    for filename in fnmatch.filter(files, "*.html"):
      if filename in exclude:
        print(filename + ' was omitted from replacing nav')
        continue
      filepath = os.path.join(path, filename)
      with open(filepath) as target_file:
        editting = target_file.read()

      # Finds existing <nav></nav> and replaces with new markdown
      editting = re.sub('<nav(.|\n)*?<\/nav>\n', newHTML, editting, count=1).split('\n')

      try:
        start = editting.index('<pre>')
        end = editting.index('</pre>')
      except:
        print('Could not replace nav for ' + filename)
        continue

      # Delete </pre> tag first
      del editting[end:end+1]
      del editting[start-1:start+1]

      # Rejoins strings
      editting = '\n'.join(editting)


      # Write to file
      with open(filepath, "w") as file:
        file.write(editting)
