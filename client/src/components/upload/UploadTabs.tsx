import { 
  CloudArrowUpIcon, 
  LinkIcon 
} from "@heroicons/react/24/outline";
import Tabs from "../ui/Tabs";

interface UploadTabsProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
}

export default function UploadTabs({ activeTab, setActiveTab }: UploadTabsProps) {
  const tabs = [
    {
      id: 'upload',
      label: 'Upload Files',
      icon: <CloudArrowUpIcon className="h-4 w-4" />
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: <LinkIcon className="h-4 w-4" />
    }
  ];

  return (
    <div className="w-full max-w-2xl">
      <Tabs 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}
