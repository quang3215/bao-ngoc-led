"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";

interface CategoryQuickLinksProps {
  links: {
    id?: string;
    title: string;
    href: string;
    image: string;
    isNew?: boolean;
    isSale?: boolean;
  }[];
}

export function CategoryQuickLinks({ links }: CategoryQuickLinksProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let intervalId: NodeJS.Timeout;

    const startAutoScroll = () => {
      intervalId = setInterval(() => {
        if (!container) return;
        
        const isEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 10;
        
        if (isEnd) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: 300, behavior: 'smooth' });
        }
      }, 3500); // Tự động chạy mỗi 3.5 giây
    };

    startAutoScroll();

    // Tạm dừng khi rê chuột vào
    container.addEventListener('mouseenter', () => clearInterval(intervalId));
    container.addEventListener('mouseleave', startAutoScroll);
    container.addEventListener('touchstart', () => clearInterval(intervalId));
    container.addEventListener('touchend', startAutoScroll);

    return () => {
      clearInterval(intervalId);
      container.removeEventListener('mouseenter', () => clearInterval(intervalId));
      container.removeEventListener('mouseleave', startAutoScroll);
      container.removeEventListener('touchstart', () => clearInterval(intervalId));
      container.removeEventListener('touchend', startAutoScroll);
    };
  }, []);

  if (!links || links.length === 0) return null;

  return (
    <section className="py-6 bg-[#f4f5f7]">
      <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {links.map((link, idx) => (
            <Link 
              key={idx} 
              href={link.href}
              className="group block relative bg-white rounded-lg p-5 h-36 sm:h-40 overflow-hidden shadow-sm hover:shadow-md transition-shadow shrink-0 w-[260px] sm:w-[320px] lg:w-[360px] snap-start"
            >
              <h3 className="text-lg md:text-xl font-medium text-gray-800 z-10 relative max-w-[60%]">
                {link.title}
              </h3>
              
              <div className="absolute bottom-0 right-0 w-3/5 h-full flex items-end justify-end p-2 transition-transform duration-300 group-hover:scale-105">
                <div className="relative w-full h-[80%]">
                  <Image 
                    src={link.image} 
                    alt={link.title} 
                    fill 
                    className="object-contain object-right-bottom"
                  />
                </div>
              </div>

              {link.isNew && (
                <div className="absolute top-0 right-0">
                  <div className="bg-red-500 text-white font-bold text-xs px-8 py-1 uppercase tracking-wider transform translate-x-1/4 -translate-y-1/2 rotate-45 mt-4 mr-[-10px] shadow-sm">
                    NEW
                  </div>
                </div>
              )}
              
              {link.isSale && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-orange-500 text-white font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap shadow-sm">
                    Siêu khuyến mãi
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
