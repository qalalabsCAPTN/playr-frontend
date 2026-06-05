"use client"

import React, { useEffect, useRef, useState } from "react"
import { CMSService, CMSAboutPageData } from "@playr/nectar-core"

export default function AboutPage() {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [data, setData] = useState<CMSAboutPageData | null>(null)

  useEffect(() => {
    CMSService.getAboutPageBlocks().then(setData)
  }, [])

  useEffect(() => {
    if (!data) return;

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0')
          entry.target.classList.remove('opacity-0', 'translate-y-10')
        }
      })
    }, { threshold: 0.1 })

    const elements = document.querySelectorAll('.animate-on-scroll')
    elements.forEach(el => {
      observerRef.current?.observe(el)
    })

    return () => {
      if (observerRef.current) observerRef.current.disconnect()
    }
  }, [data])

  if (!data) return <div className="min-h-screen bg-[#fdf9f0]"></div>;

  const { hero, brandStory } = data;

  return (
    <div className="bg-[#fdf9f0] min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] flex items-center overflow-hidden bg-on-surface">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        </div>
        <div className="relative z-10 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000">
          {hero.badge && (
            <div className="inline-block px-4 py-1 bg-action-yellow text-on-surface rounded-full mb-6 font-label-bold uppercase">
              {hero.badge}
            </div>
          )}
          <h1 className="font-headline-xl text-5xl md:text-7xl text-white mb-8 tracking-tighter leading-tight font-black">
            {hero.heading1}<br/>{hero.heading2}
          </h1>
          <p className="font-body-lg text-white/90 max-w-xl mb-10 leading-relaxed text-lg">
            {hero.description}
          </p>
          <button className="px-10 py-5 bg-action-yellow text-on-surface font-black uppercase text-label-bold rounded-lg hover:scale-105 transition-transform active:scale-95 shadow-xl tracking-widest">
            {hero.primaryCta.label}
          </button>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000">
          <div className="order-2 lg:order-1">
            <h2 className="font-headline-xl text-4xl mb-12 uppercase tracking-tight font-black text-on-surface">{brandStory.heading}</h2>
            <div className="space-y-10">
              {brandStory.timeline.map((item, idx) => (
                <div key={idx} className="flex gap-6 items-start group">
                  <span className="font-headline-xl text-5xl text-outline-variant group-hover:text-primary transition-colors">{item.year}</span>
                  <div>
                    <h3 className="font-headline-md text-2xl mb-2 font-bold text-on-surface">{item.title}</h3>
                    <p className="text-secondary font-body-md leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-2xl bg-surface-container border border-outline-variant/30">
              <div className="absolute inset-0 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-6xl">photo_camera</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision: Bento Layout */}
      <section className="py-24 bg-surface-container-low border-y border-outline-variant/20">
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
            <div className="bg-surface-container-lowest p-12 rounded-3xl flex flex-col justify-between group hover:bg-on-surface transition-all duration-500 border border-outline-variant/30 shadow-sm hover:shadow-2xl">
              <div>
                <span className="material-symbols-outlined text-4xl text-primary mb-6 group-hover:text-action-yellow transition-colors">visibility</span>
                <h2 className="font-headline-xl text-4xl mb-6 group-hover:text-white transition-colors font-black tracking-tight">{brandStory.vision.heading}</h2>
                <p className="font-body-lg text-secondary group-hover:text-white/80 transition-colors leading-relaxed text-lg">
                  {brandStory.vision.description}
                </p>
              </div>
              <div className="mt-12 h-1 bg-surface-container-highest w-full relative overflow-hidden rounded-full">
                <div className="absolute inset-0 bg-action-yellow w-0 group-hover:w-full transition-all duration-700"></div>
              </div>
            </div>
            
            <div className="bg-primary p-12 rounded-3xl flex flex-col justify-between group hover:shadow-2xl transition-all duration-500 border border-primary-fixed/20 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4">
                <span className="material-symbols-outlined text-9xl text-white">rocket_launch</span>
              </div>
              <div className="relative z-10">
                <span className="material-symbols-outlined text-4xl text-action-yellow mb-6">rocket_launch</span>
                <h2 className="font-headline-xl text-4xl mb-6 text-white font-black tracking-tight">{brandStory.mission.heading}</h2>
                <div className="space-y-6">
                  <p className="font-body-lg text-white font-bold border-l-4 border-action-yellow pl-6 text-lg leading-relaxed">
                    {brandStory.mission.description1}
                  </p>
                  <p className="font-body-lg text-white/80 text-lg leading-relaxed">
                    {brandStory.mission.description2}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto overflow-hidden">
        <div className="text-center mb-20 animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000">
          <h2 className="font-headline-xl text-4xl uppercase tracking-tight font-black text-on-surface">Our Core Values</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000">
          
          {brandStory.coreValues.map((value, idx) => (
            <div key={idx} className={`relative p-10 border rounded-3xl group hover:-translate-y-2 transition-transform duration-500 ${idx === 1 ? 'bg-on-surface border-on-surface shadow-xl' : 'bg-surface-container-lowest border-outline-variant/30 shadow-sm hover:shadow-xl'}`}>
              <div className={`absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 flex items-center justify-center rounded-full shadow-lg ${idx === 1 ? 'bg-action-yellow text-on-surface font-black' : 'bg-on-surface text-action-yellow'}`}>
                <span className="material-symbols-outlined">{value.icon}</span>
              </div>
              <h3 className={`font-headline-md text-2xl text-center mt-6 mb-4 font-bold ${idx === 1 ? 'text-white' : 'text-on-surface'}`}>{value.title}</h3>
              <p className={`text-center font-body-md leading-relaxed ${idx === 1 ? 'text-white/70' : 'text-secondary'}`}>{value.description}</p>
            </div>
          ))}

        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-on-surface text-white">
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xs text-center md:text-left">
              <h2 className="font-headline-md text-3xl mb-2 font-black tracking-tighter">GLOBAL PARTNERS</h2>
              <p className="font-label-bold text-sm text-white/50 uppercase tracking-widest">OFFICIAL MERCHANDISE SUPPLIERS</p>
            </div>
            <div className="flex flex-wrap justify-center gap-12 opacity-60">
              {brandStory.partners.map(partner => (
                <div key={partner} className="font-headline-xl text-5xl tracking-widest font-black hover:text-action-yellow hover:opacity-100 transition-all cursor-default">
                  {partner}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
