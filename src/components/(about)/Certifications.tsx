import Carousel from "@/components/ui/Carousel";
import { CertificateProps } from "@/types";
import { LiaCertificateSolid } from "react-icons/lia";
import { motion } from "framer-motion";

export default function Certifications({
  certificates,
}: {
  certificates: CertificateProps[];
}) {
  const sortedCertificates = [...certificates].sort(
    (a, b) => (b.order_index ?? 0) - (a.order_index ?? 0)
  );

  return (
    <Carousel
      items={sortedCertificates}
      title="Certifications"
      renderItem={(item) => (
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="group flex flex-col h-full p-6 rounded-2xl border border-border bg-background/70 backdrop-blur-lg shadow-md hover:shadow-xl transition-all duration-300 hover:border-accent/40"
        >
          <div className="flex items-start gap-4 mb-4">
            {item.logo_url && (
              <img
                src={item.logo_url}
                alt={item.organization}
                className="w-12 h-12 object-contain rounded-lg bg-white p-1"
              />
            )}

            <div className="flex-1">
              <div className="text-lg font-semibold flex gap-2">
                <LiaCertificateSolid className="text-accent mt-1" size={20} />
                {item.title}
              </div>
              <p className="text-accent font-medium mt-1">
                {item.organization}
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            {item.issue_date && (
              <p className="text-sm text-muted-foreground">
                Issued: {formatDate(item.issue_date)}
              </p>
            )}
            {item.description && (
              <p className="text-sm text-muted-foreground line-clamp-3">
                {item.description}
              </p>
            )}
          </div>

          {item.credential_url && (
            <div className="mt-auto pt-4 border-t border-border/50">
              <a
                href={item.credential_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-accent hover:underline"
              >
                View Credential ↗
              </a>
            </div>
          )}
        </motion.div>
      )}
    />
  );
}

function formatDate(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}