import type { PageBlock, BookingPage, Translatable } from '#/lib/experiences'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState, type ChangeEvent } from 'react'

export const Route = createFileRoute('/_authed/experiences')({
  component: RouteComponent,
})

type SkeletonPageData = Omit<BookingPage, "blocks" | "createdAt" | "updatedAt" | "id" | "slug"> & {
  [key: string]: any; // <-- This is the index signature
};

function RouteComponent() {
  const [lang, setLang] = useState<"en"|"af">("en");
  const [pageData, setPageData] = useState<SkeletonPageData>({
    defaultLanguage:"en",
    enabledLanguages: ["en"],
    title: {
      default: "",
      translations: {
        af:""
      }
    },
    description: {
      default: "",
      translations: {
        af:""
      }
    }
  });
  const [blocks, setBlocks] = useState<PageBlock[]>([]);

  // Define a type specifically for your translatable fields

  const handelPageDataChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    const lang: string = event.target.dataset.lang || "en";

    // Type-guard to ensure we are only touching 'title' or 'description'
    if (name !== 'title' && name !== 'description') return;

    setPageData((prev) => {
      const field = prev[name]!; // TypeScript now safely knows this is translatable

      return {
        ...prev,
        [name]: {
          ...field,
          default: lang === "en" ? value : field.default,
          translations: lang === "en" ? field.translations : {
            ...field.translations,
            [lang]: value
          }
        }
      };
    });
  };

  const getPageValueFromTranslatable = (key: string): string => {
    if (typeof pageData[key] != "object") {
      return ""
    }
    
    return lang == "en"? pageData[key].default: pageData[key].translations[lang];
  }

  return <div className='flex w-full h-full bg-zinc-950'>
    <div id='left' className='flex-2 bg-pink-300'></div>
    <div id="right" className='flex-1 bg-green-300'>
      <fieldset className='p-2 m-3 flex flex-col gap-2'>
        <label>Languages:</label>
        <input onClick={()=>setLang("en")} type="radio" name="test_group" value="A"/><label>English</label>
        <input onClick={()=>setLang("af")} type="radio" name="test_group" value="B"/><label>Afrikaans</label>
      </fieldset>
      <fieldset className='p-2 m-3 flex flex-col gap-2'>
        <label htmlFor="title">Title</label>
        <input 
          name='title' 
          data-lang={lang} 
          onChange={handelPageDataChange} 
          value={getPageValueFromTranslatable("title")} 
          className='m-2 border-2 rounded-lg border-black' 
          id='title' type="text" placeholder='title' 
          />
      </fieldset>

      <fieldset className='p-2 m-3 flex flex-col gap-2'>
        <label htmlFor="desc">description</label>
        <textarea
          name="description"
          data-lang={lang}
          onChange={handelPageDataChange}  // ← still missing
          value={getPageValueFromTranslatable("description")}
          className='m-2 border-2 rounded-lg border-black'
          id="desc"
        />
      </fieldset>
    </div>
  </div>
}
