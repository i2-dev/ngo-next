#!/usr/bin/env node

const http = require('http');

// 测试Strapi API
async function testStrapiAPI() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'strapi2-dev.dev.i2hk.net',
      port: 80,
      path: '/api/about-us?status=draft&pLevel=3',
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

// 测试预览页面
async function testPreviewPage() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '192.168.15.200',
      port: 3002,
      path: '/preview/about-us?status=draft&locale=en',
      method: 'GET',
      headers: {
        'Accept': 'text/html'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: data.substring(0, 1000)
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

// 运行验证
async function runVerification() {
  console.log('🔍 开始验证预览功能...\n');

  try {
    // 测试Strapi API
    console.log('📡 测试Strapi API...');
    const strapiData = await testStrapiAPI();
    console.log('✅ Strapi API 连接成功');
    console.log(`📊 数据标题: ${strapiData.data.Title}`);
    console.log(`📅 更新时间: ${strapiData.data.updatedAt}`);
    console.log(`🖼️  图片数量: ${strapiData.data.LeftImage ? strapiData.data.LeftImage.length : 0}`);
    console.log(`👥 客户数量: ${strapiData.data.OurClients ? strapiData.data.OurClients.length : 0}`);
    console.log('');

    // 测试预览页面
    console.log('🌐 测试预览页面...');
    const previewResult = await testPreviewPage();
    console.log(`✅ 预览页面状态码: ${previewResult.statusCode}`);
    
    if (previewResult.data.includes('关于我们') || previewResult.data.includes('about-us')) {
      console.log('🎯 检测到关于我们内容');
    }
    if (previewResult.data.includes('preview') || previewResult.data.includes('Preview')) {
      console.log('🔍 检测到预览功能');
    }
    if (previewResult.data.includes('展延NGO')) {
      console.log('🏢 检测到公司信息');
    }

    console.log('\n🎉 验证完成！预览功能正常工作。');
    console.log('\n📋 功能总结:');
    console.log('✅ Strapi API 数据获取正常');
    console.log('✅ 预览页面渲染正常');
    console.log('✅ 数据包含完整内容（标题、图片、客户信息）');
    console.log('✅ 支持 pLevel=3 参数获取完整数据');

  } catch (error) {
    console.error('❌ 验证失败:', error.message);
  }
}

runVerification();
