"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Menu } from "lucide-react";
import { useSettingsStore } from "@/store/settings";
import { cn } from "@/lib/utils";

export function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const categories = useSettingsStore(state => state.settings.categories);

  if (!categories || categories.length === 0) return null;

  return (
    <div 
      className="relative h-full"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="flex items-center h-full bg-[#4A238B] text-white px-4 gap-2 font-bold text-sm shrink-0 cursor-pointer rounded-l hover:bg-[#35156B] transition-colors">
        <Menu className="w-5 h-5" />
        <span>Danh mục</span>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 flex bg-white rounded-b-xl shadow-2xl border border-gray-100 overflow-hidden min-w-[800px] min-h-[450px]">
          {/* Left Sidebar - Main Categories */}
          <div className="w-[300px] bg-white border-r border-gray-100 py-4 flex flex-col">
            {categories.map((category: any, index) => {
              const isActive = activeIndex === index;
              const isDirectLink = !!category.href;
              const hasSub = category.subCategories && category.subCategories.length > 0;

              const content = (
                <div className="flex items-center">
                  {/* Icon */}
                  <div className="w-6 h-6 mr-3 relative flex-shrink-0 group">
                    {category.iconUrl && (
                      <>
                        <img 
                          src={category.iconUrl} 
                          alt="icon" 
                          className={cn(
                            "w-full h-full object-contain duration-200",
                            isActive ? "opacity-0 invisible" : "opacity-100 visible"
                          )} 
                        />
                        <img 
                          src={category.iconHoverUrl || category.iconUrl} 
                          alt="icon hover" 
                          className={cn(
                            "absolute top-0 left-0 w-full h-full object-contain duration-200",
                            isActive ? "opacity-100 visible" : "opacity-0 invisible"
                          )} 
                        />
                      </>
                    )}
                  </div>
                  <span className={cn(
                    "font-semibold text-sm",
                    isActive ? "text-[#4A238B]" : "text-gray-600"
                  )}>
                    {category.name}
                  </span>
                </div>
              );

              const targetHref = category.href || `/danh-muc/${category.slug}`;

              return (
                <Link
                  key={category.slug}
                  href={targetHref}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    "px-4 py-2.5 mx-2 rounded-lg flex items-center justify-between cursor-pointer transition-colors",
                    isActive ? "bg-gray-50/80" : "hover:bg-gray-50/50"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {content}
                  {hasSub && isActive && (
                    <ChevronRight className="w-4 h-4 text-[#4A238B]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Panel - Sub Categories */}
          <div className="flex-1 bg-white p-8">
            {categories[activeIndex]?.subCategories && categories[activeIndex].subCategories.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {categories[activeIndex].subCategories.map((sub: any, idx: number) => (
                  <Link 
                    key={sub.slug}
                    href={`/danh-muc/${categories[activeIndex].slug}?sub=${sub.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="block text-[14px] text-gray-700 hover:text-[#4A238B] py-1 transition-colors"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <p>Khám phá {categories[activeIndex]?.name}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
