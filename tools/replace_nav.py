import os, fnmatch, re
from bs4 import BeautifulSoup, Tag

markdown = """
<pre>
  <nav class="hide">
    <div class="nav-darken-overlay" onclick="navigation.exitModal();"></div>
    <div class="nav-top-bar">
      <button class="hamburger hamburger-spin" type="button" onclick="navigation.toggleLeftMenu();">
        <span class="hamburger-box">
          <span class="hamburger-inner"></span>
        </span>
      </button>
      <a class="nav-home-btn" id="nav-home-btn" href="/"></a>
      <div class="nav-in" id="nav-in" onclick="navigation.toggleRightMenu();"></div>
      <div class="nav-mobile-out" id="nav-mobile-out" onclick="navigation.toggleRightMenu();"></div>
      <div class="nav-desktop-out">
        <a href="/login" id="nav-user-login">LOG IN</a>
        <a class="grad-btn" href="/signup" id="nav-user-signup">SIGN UP</a>
      </div>
    </div>
    <div class="nav-side-menus">
      <div class="nav-left-menu-wrap">
        <div class="nav-left-menu">
          <div class="nav-side-menu-links">
            <p class="nav-side-header">CREATEBASE</p>
            <a class="nav-side-item" href="/make">MAKE</a>
            <a class="nav-side-item" href="/products/engkits">KITS</a>
            <a class="nav-side-item" href="/services/marketplace">SHOP</a>
            <p class="nav-side-header">INFO</p>
            <a class="nav-side-item" href="/services/3d-printing">3D PRINTING</a>
            <a class="nav-side-item" href="/products/engkits">ENGINEERING KITS</a>
            <a class="nav-side-item" href="/services/marketplace">MARKETPLACE</a>
            <a class="nav-side-item" href="/faq">FAQ</a>
            <p class="nav-side-header">ABOUT</p>
            <a class="nav-side-item" href="/story">OUR STORY</a>
            <a class="nav-side-item" href="/team">OUR TEAM</a>
            <a class="nav-side-item" href="/contact">CONTACT US</a>
          </div>
          <div class="nav-side-socials">
            <a class="fab fa-facebook-square"
              href="https://www.facebook.com/CreateBase-110365053954978/?view_public_for=110365053954978"
              target="_blank"></a>
            <a class="fab fa-instagram" href="https://www.instagram.com/createbasenz/" target="_blank"></a>
            <a class="fab fa-twitter" href="https://twitter.com/CreateBaseNZ" target="_blank"></a>
            <a class="fab fa-youtube" href="https://www.youtube.com/user/LouiiL" target="_blank"></a>
          </div>
        </div>
      </div>
      <div class="nav-right-menu-out">
        <div class="nav-right-menu">
          <p class="nav-side-header">WELCOME BACK</p>
          <a class="nav-side-item" href="/login">LOG IN</a>
          <p class="nav-side-header">FIRST TIME?</p>
          <a class="nav-side-item" href="/signup">SIGN UP</a>
        </div>
      </div>
      <div class="nav-right-menu-in">
        <div class="nav-right-menu" id="nav-right-menu">
          <p class="nav-side-header" id="nav-right-greeting"></p>
          <a class="nav-side-item" href="/profile">DASHBOARD</a>
          <a class="nav-side-item" href="/profile/projects">MY PROJECTS</a>
          <a class="nav-side-item" href="/profile/orders">MY ORDERS</a>
          <a class="nav-side-item" href="/profile/settings">SETTINGS</a>
          <a class="nav-side-signout" href="/logout">SIGN OUT</a>
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
  print(newHTML)

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
