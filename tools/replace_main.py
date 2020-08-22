# This is the main script for automating HTML manipulations across all pages.

import replace_nav
import replace_footer

nav_omit = ["profile.html", "test.html"]
footer_omit = ["checkout.html", "login.html", "make.html", "profile.html", "signup.html", "test.html"]

print('Replacing header:')
replace_nav.execute(nav_omit)
print('\nReplacing footer:')
replace_footer.execute(footer_omit)