import { Link } from "react-router-dom";
import { MapPin, BadgeCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { Profile } from "@/data/mockProfiles";

interface ProfileCardProps {
  profile: Profile;
  index: number;
}

const ProfileCard = ({ profile, index }: ProfileCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link
        to={`/perfil/${profile.id}`}
        className="group block overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-card-hover hover:border-primary/30"
      >
        {/* Photo placeholder */}
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
          <div className="flex h-full items-center justify-center gradient-hero">
            <span className="font-display text-4xl font-bold text-primary-foreground/40">
              {profile.nome[0]}
            </span>
          </div>

          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {profile.destaque && (
              <span className="flex items-center gap-1 rounded-full gradient-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                <Sparkles size={10} /> Destaque
              </span>
            )}
            {profile.verificada && (
              <span className="flex items-center gap-1 rounded-full bg-card/90 backdrop-blur px-2 py-0.5 text-[10px] font-semibold text-primary">
                <BadgeCheck size={10} /> Verificada
              </span>
            )}
          </div>

          {/* Category */}
          <div className="absolute bottom-2 right-2">
            <span className="rounded-full bg-card/90 backdrop-blur px-2 py-0.5 text-[10px] font-medium text-foreground">
              {profile.categoria}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-semibold text-foreground">
              {profile.nome}, {profile.idade}
            </h3>
          </div>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin size={12} />
            {profile.bairro}, Macapá
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProfileCard;
