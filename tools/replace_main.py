# This is the main script for automating HTML manipulations across all pages.

import replace_nav
import replace_footer

nav_omit = []
footer_omit = ["test.html"]

replace_nav.execute(nav_omit)
replace_footer.execute(footer_omit)