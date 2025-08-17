export function knowledge1(input) {
  const greetings = ["hi","hello","hey","မင်္ဂလာပါ"];
  if (greetings.includes(input.toLowerCase())) {
    return "👋 မင်္ဂလာပါ၊ ကြိုဆိုပါတယ်။";
  }
  return null;
}
