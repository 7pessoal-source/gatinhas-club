"use client";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { bairros, categorias } from "@/data/mockProfiles";
import { motion, AnimatePresence } from "framer-motion";

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedBairro: string;
  onBairroChange: (b: string) => void;
  selectedCategoria: string;
  onCategoriaChange: (c: string) => void;
  idadeRange: [number, number];
  onIdadeChange: (r: [number, number]) => void;
}

const SearchFilters = ({
  searchQuery,
  onSearchChange,
  selectedBairro,
  onBairroChange,
  selectedCategoria,
  onCategoriaChange,
}: SearchFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-input bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
            showFilters
              ? "border-primary bg-primary text-primary-foreground"
              : "border-input bg-background text-muted-foreground hover:text-foreground"
          }`}
        >
          <SlidersHorizontal size={16} />
          <span className="hidden sm:inline">Filtros</span>
        </button>
      </div>

      {/* Filters panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden rounded-xl border border-border bg-card p-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Bairro */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">
                  Bairro
                </label>
                <select
                  value={selectedBairro}
                  onChange={(e) => onBairroChange(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Todos os bairros</option>
                  {bairros.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Categoria */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">
                  Categoria
                </label>
                <select
                  value={selectedCategoria}
                  onChange={(e) => onCategoriaChange(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Todas as categorias</option>
                  {categorias.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active filters */}
            {(selectedBairro || selectedCategoria) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedBairro && (
                  <span className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                    {selectedBairro}
                    <button onClick={() => onBairroChange("")}><X size={12} /></button>
                  </span>
                )}
                {selectedCategoria && (
                  <span className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                    {selectedCategoria}
                    <button onClick={() => onCategoriaChange("")}><X size={12} /></button>
                  </span>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchFilters;
