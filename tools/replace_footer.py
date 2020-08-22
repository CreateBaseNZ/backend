import os, fnmatch, re
from bs4 import BeautifulSoup, Tag

markdown = """
<pre>
  <footer class="footer-section hide">
    <div class="footer-content">
      <div class="footer-legal-section">
        <h4>INFO</h4>
        <div class="footer-legal-content">
          <ul class="list-section-left">
            <li><a href="/faq">Shipping Info</a></li>
            <li><a href="/faq">Returns / Exchanges</a></li>
          </ul>
          <ul class="list-section-desktop">
            <li><a href="/services/3d-printing">3D Printing</a></li>
            <li><a href="/services/marketplace">Marketplace</a></li>
            <li><a href="/products/engkits">Engineering Kits</a></li>
          </ul>

          <div class="list-section-divider"></div>

          <ul class="list-section-right">
            <li><a href="/tac">Terms & Conditions</a></li>
            <li><a href="/privpol">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-contact-section">
        <h4>CONTACT</h4>
        <div class="footer-contact-content">
          <div class="contact-email"><a href="mailto:admin@createbase.co.nz">admin@createbase.co.nz</a></div>

          <div class="btn-subscribe">
            <button class="reg-btn" id="footer-subscribe">SUBSCRIBE TO NEWSLETTER</button>
          </div>

          <div class="contact-socials">
            <a href="https://www.facebook.com/CreateBase-110365053954978/?view_public_for=110365053954978"
              class="fab fa-facebook-square" target="_blank"></a>
            <a href="https://www.instagram.com/createbasenz/" class="fab fa-instagram" target="_blank"></a>
            <a href="https://twitter.com/CreateBaseNZ" class="fab fa-twitter" target="_blank"></a>
            <a href="https://www.youtube.com/channel/UClLBwFvHpGrRpxyRg1IOB0g/featured?view_as=subscriber" class="fab fa-youtube" target="_blank"></a>
          </div>
          <div class="contact-legal">
            <a href="/tac" id="tac">Terms & Conditions</a>
            <a href="/privpol" id="privpol">Privacy Policy</a>
          </div>
        </div>
      </div>

      <div class="footer-sitemap-section">
        <h4>EXPLORE</h4>
        <div class="footer-sitemap-content">
          <ul>
            <li><a href="/make">3D Printing</a></li>
            <li><a href="/services/marketplace">Marketplace</a></li>
            <li><a href="/products/engkits">Engineering Kits</a></li>
            <li><a href="/story">Our Story</a></li>
            <li><a href="/team">Our Team</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-copyright-section">
        <h3>&copy; 2020 CREATEBASE. ALL RIGHTS RESERVED</h3>
      </div>
    </div>
  </footer>
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
        print(filename + ' was omitted from replacing footer')
        continue
      filepath = os.path.join(path, filename)
      with open(filepath) as target_file:
        editting = target_file.read()

      # Finds existing <nav></nav> and replaces with new markdown
      editting = re.sub('<footer(.|\n)*?<\/footer>\n', newHTML, editting, count=1).split('\n')

      try:
        start = editting.index('<pre>')
        end = editting.index('</pre>')
      except:
        print('Could not replace footer for ' + filename)
        continue

      # Delete </pre> tag first
      del editting[end:end+1]
      del editting[start-1:start+1]

      # Rejoins strings
      editting = '\n'.join(editting)


      # Write to file
      with open(filepath, "w") as file:
        file.write(editting)
