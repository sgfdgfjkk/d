import io
src = io.open('script.js', encoding='utf-8').read()
old = "    .classList.remove('gold-round');"
new = "    document.getElementById('bvStage').classList.remove('gold-round');"
assert old in src
src = src.replace(old, new, 1)
io.open('script.js', 'w', encoding='utf-8').write(src)
print('fixed', src.count('{') - src.count('}'))