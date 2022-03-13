# 🎯 sparse

### Utils usage
```typescript
const browser = await getBrowser();

// define callback in browser context
function callback() {
  const el = document.getElementById('firstHeading');
  return el.innerText;
}

const result = await executePageEvaluator(
  browser, 
  'https://en.wikipedia.org/wiki/Draft_Eisenhower_movement',
  callback
);

console.log('inner heading is ', result);

await browser.close();
```