'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import StrapiImage from '@/components/StrapiImage';
import CategoryBadge from '@/components/news/CategoryBadge';
import ArticleNavigation from '@/components/news/ArticleNavigation';
import { getAdjacentArticles } from '@/utils/get-adjacent-articles';
import PreviewWrapper from '@/components/PreviewWrapper';
import PageContainer from '@/components/blocks/PageContainer';
import PageSection from '@/components/blocks/PageSection';
import { buildPreviewApiUrl } from '@/utils/get-strapi-url';

async function getPreviewArticleData(documentId, status = 'draft') {
  try {
    const apiUrl = buildPreviewApiUrl('informations', documentId, { status, pLevel: 5 });
    const response = await fetch(apiUrl, {
      cache: 'no-store', // 禁用缓存以确保获取最新预览数据
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching preview article data:', error);
    return null;
  }
}

export default function NewsDetailPreview() {
  const searchParams = useSearchParams();
  const params = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adjacentArticles, setAdjacentArticles] = useState({ previous: null, next: null });

  const status = searchParams.get('status') || 'draft';
  const locale = searchParams.get('locale') || 'en';
  const documentId = params?.id;

  useEffect(() => {
    const fetchPreviewData = async () => {
      if (!documentId) {
        setError('Document ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // 获取文章数据
        const articleData = await getPreviewArticleData(documentId, status);
        
        if (!articleData) {
          setError('Article not found');
          setLoading(false);
          return;
        }

        setArticle(articleData);

        // 获取相邻文章
        try {
          const { previous, next } = await getAdjacentArticles(documentId, locale);
          setAdjacentArticles({ previous, next });
        } catch (adjacentError) {
          console.error('Error fetching adjacent articles:', adjacentError);
          // 相邻文章获取失败不影响主文章显示
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching preview data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPreviewData();
  }, [documentId, status, locale]);

  if (!article && !loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h2 className="text-red-800 text-xl font-semibold mb-2">文章未找到</h2>
            <p className="text-red-600">无法找到指定的文章</p>
            <div className="mt-4 text-sm text-gray-600">
              <p>文档ID: {documentId}</p>
              <p>状态: {status}</p>
              <p>语言: {locale}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PreviewWrapper
      contentType="NGO最新新闻"
      data={article}
      loading={loading}
      error={error}
    >
      <PageContainer className={'!mt-29'}>      
        {/* Article Header */}
        <div className="flex items-center text-center w-full min-h-[250px] md:min-h-[350px] py-12.5 bg-[rgba(247,242,244,0.5)] backdrop-filter-[blur(10px)]">
          <div className="xl:container xl:max-w-[1040px] xl:mx-auto px-5">
            {/* Category Badge */}
            {article?.information_category && (
              <CategoryBadge category={article.information_category} locale={locale} />
            )}

            {/* Title */}
            <h1 className="text-3xl text-[#272727] mb-5 md:text-[42px]">
              {article?.Title || '文章标题'}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap justify-center text-sm">            
              {article?.Publish && (
                <div className="flex items-center">
                  <span className="font-medium">發布日期：</span>
                  <span>{article.Publish}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <PageSection className={'!pt-12.5'}> 
          {article?.Author_Summary && (            
              <h3 className="text-center text-[22px] mb-7.5">{article.Author_Summary}</h3>          
          )}

          {/* Article Content */}      
          <article className="overflow-hidden xl:max-w-[1040px] xl:mx-auto px-5">
            {/* Featured Image */}
            {article?.image && article.image.length > 0 && (
              <div className="relative h-64 md:h-96 overflow-hidden mb-8">
                <StrapiImage
                  image={article.image[0]}
                  className="w-full h-full object-cover"
                  width={800}
                  height={400}
                  alt={article.Title || 'Article image'}
                />
              </div>
            )}

            {/* Article Content */}          
            {article?.NewsContent ? (
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: article.NewsContent }}
              />
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">內容正在準備中...</div>
                <div className="text-gray-400 text-sm mt-2">Content is being prepared...</div>
              </div>
            )}          
          </article>        
          
        </PageSection>
        
        {/* Article Navigation */}
        <ArticleNavigation
          previous={adjacentArticles.previous}
          next={adjacentArticles.next}
          locale={locale}
        />
      </PageContainer>
    </PreviewWrapper>
  );
}
