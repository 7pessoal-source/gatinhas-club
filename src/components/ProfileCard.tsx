import { Link } from "react-router-dom";
import { MapPin, BadgeCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { Profile } from "@/data/mockProfiles";

interface ProfileCardProps {
  profile: Profile;
  index: number;
}

const ProfileCard = ({ profile, index }: ProfileCardProps) => {
  const foto = profile.foto_principal || profile.fotos?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link
        to={`/perfil/${profile.id}`}
        className="group block overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-card-hover"
        title={`Ver perfil de ${profile.nome} – ${profile.categoria} em ${profile.bairro}, Macapá`}
      >
        {/* Foto */}
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
          {foto ? (
            <img
              src={foto}
              alt={`${profile.nome} – ${profile.categoria} em ${profile.bairro}, Macapá`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="flex h-full items-center justify-center gradient-hero">
              <span className="font-display text-4xl font-bold text-primary-foreground/40">
                {profile.nome[0]}
              </span>
            </div>
          )}

          {/* Overlay gradiente no fundo para legibilidade */}
          {foto && (
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
          )}

          {/* Badges topo */}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {profile.destaque && (
              <span className="flex items-center gap-1 rounded-full gradient-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground shadow">
                <Sparkles size={10} /> Destaque
              </span>
            )}
            {profile.verificada && (
              <span className="flex items-center gap-1 rounded-full bg-card/90 px-2 py-0.5 text-[10px] font-semibold text-primary backdrop-blur">
                <BadgeCheck size={10} /> Verificada
              </span>
            )}
          </div>

          {/* Categoria */}
          <div className="absolute bottom-2 right-2">
            <span className="rounded-full bg-card/90 px-2 py-0.5 text-[10px] font-medium text-foreground backdrop-blur">
              {profile.categoria}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="font-display text-base font-semibold text-foreground" itemProp="name">
            {profile.nome}, {profile.idade}
          </h3>
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
