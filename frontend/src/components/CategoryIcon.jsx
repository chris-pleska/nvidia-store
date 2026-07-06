import DatacenterGpuIcon from "./icons/DatacenterGpuIcon.jsx";
import DesktopGpuIcon from "./icons/DesktopGpuIcon.jsx";
import LaptopGpuIcon from "./icons/LaptopGpuIcon.jsx";
import ProfessionalGpuIcon from "./icons/ProfessionalGpuIcon.jsx";
import RackSystemIcon from "./icons/RackSystemIcon.jsx";
import ServerIcon from "./icons/ServerIcon.jsx";

const ICONS_BY_CATEGORY = {
  "Desktop GPU": DesktopGpuIcon,
  "Laptop GPU": LaptopGpuIcon,
  "Professional GPU": ProfessionalGpuIcon,
  "Datacenter GPU": DatacenterGpuIcon,
  Server: ServerIcon,
  "Rack System": RackSystemIcon,
};

export default function CategoryIcon({ category, size = 48, ...props }) {
  const Icon = ICONS_BY_CATEGORY[category];
  if (!Icon) return null;

  return <Icon size={size} {...props} />;
}
