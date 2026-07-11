import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return NextResponse.json({
        analysis: `⚠️ **تنبيه مفتاح API الخاص بـ Gemini غير متوفر.**
لتفعيل التحليل المالي والتشغيلي بالذكاء الاصطناعي، يرجى تزويد مفتاح \`GEMINI_API_KEY\` من خلال إعدادات لوحة التحكم في بيئة العمل.

**التحليل المؤقت المستند إلى القواعد:**
- مبيعات اليوم تسير بشكل جيد مع إقبال قوي على **سيروم النضارة والإشراق (وشى جلو)**.
- يوجد منتجات تتطلب تعبئة عاجلة نظراً لأن كميتها أقل من الحد الأدنى المقترح (مثل **مقشر الطين الوردي**).
- يرجى مراجعة وتصفية المصاريف اليومية وتخفيض التكاليف التشغيلية لزيادة هامش الربح الصافي للبوث.`
      });
    }

    const ai = new GoogleGenAI({ apiKey: key });
    const data = await req.json();
    const { products = [], sales = [], expenses = [], date = 'اليوم' } = data;

    const prompt = `أنت خبير تشغيلي مالي رائد متمرس في قطاع التجزئة والمعارض وبناء العلامات التجارية الفاخرة للجمال (بوتيكات ومتاجر مؤقتة).
قم بإجراء تحليل ذكي وعميق لأداء بوث علامة "وشى (Washi)" لمنتجات العناية بالبشرة والشعر الطبيعية في يوم المعرض الحالي: ${date}.

البيانات الحالية للبوث:
- المنتجات والمخزون الحالي:
${JSON.stringify(products.map((p: any) => ({ name: p.name, category: p.category, price: p.price, quantity: p.quantity, minAlert: p.minAlert })), null, 2)}

- عمليات البيع الفعلية المسجلة اليوم:
${JSON.stringify(sales.map((s: any) => ({ customer: s.customerName, amount: s.amount, details: s.details, method: s.paymentMethod })), null, 2)}

- المصاريف والمدفوعات التشغيلية اليوم:
${JSON.stringify(expenses.map((e: any) => ({ title: e.title, amount: e.amount, category: e.category, confirmed: e.isConfirmed })), null, 2)}

المطلوب:
كتابة "تقرير أداء ذكاء اصطناعي يومي" لعلامة وشى باللغة العربية الفصحى الفاخرة المعتمدة لدى المتاجر العالمية الراقية.
الرجاء تنسيق التقرير بأسلوب Notion جذاب ومقروء بوضوح عبر استخدام العناوين الجانبية والنقاط والرموز التعبيرية المناسبة:

1. 📊 **الأداء المالي الإجمالي:** (صافي الربح، الإيرادات والمقارنة الإرشادية بين قنوات الدفع: كاش، بطاقة/مدى، تحويل).
2. 📦 **الحالة الحرجة للمخزون:** (تحديد السيروم أو الكريمات أو الزيوت التي تحتاج نقل فوري من المستودع المركزي للرفوف مع حساب النقص).
3. 💡 **التوصيات التشغيلية والترويجية للغد:** (اقتراح عروض تفاعلية لزوار المعرض، وتنسيق تسليم الطلبات المدفوعة مسبقاً، وإدارة حركة الزوار لتحقيق أقصى ربح).

اجعل التقرير مشجعاً ويحمل طابع علامة وشى الفاخرة والمهنية العالية.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return NextResponse.json({ analysis: response.text });
  } catch (error: any) {
    console.error("Gemini analysis error:", error);
    return NextResponse.json({
      error: true,
      analysis: `❌ **حدث خطأ أثناء إجراء التحليل الذكي:** ${error.message || 'خطأ غير معروف'}. يرجى المحاولة لاحقاً.`
    });
  }
}
