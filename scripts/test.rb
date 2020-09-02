#require 'github/markup'
#GitHub::Markup.render('README.md', "* One\n* Two")

require 'github/markup'
puts GitHub::Markup.render('README.md', File.read("test.txt"))
