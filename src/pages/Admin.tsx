import { Info, Settings2 } from "lucide-react";
import { useState } from "react";
import EntityEditor from "@/components/admin/EntityEditor";
import { RESOURCES, RESOURCE_ORDER } from "@/components/admin/configs";
import { InfoNote, PageHeader, SegmentedControl } from "@/components/shared";

export default function Admin() {
  const [active, setActive] = useState<string>("sessions");
  const config = RESOURCES[active];

  return (
    <div className="space-y-5">
      <PageHeader
        title="إدارة المحتوى"
        desc="أضف وعدّل كل محتوى المنصة — المهام، الروابط، الرسائل، الملفات، الدليل والمزيد."
      />

      <InfoNote icon={Info}>
        كل تعديل هنا يُحفظ في قاعدة البيانات ويظهر فورًا للمساعد — استخدمها كلما
        ظهرت مهمة خاصة جديدة أو تغيّر أي محتوى.
      </InfoNote>

      <SegmentedControl
        value={active}
        onChange={setActive}
        options={RESOURCE_ORDER.map((key) => ({
          value: key,
          label: `${RESOURCES[key].emoji} ${RESOURCES[key].label}`,
        }))}
      />

      <EntityEditor key={config.key} config={config} />
    </div>
  );
}
