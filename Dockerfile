FROM nginx:alpine

LABEL author="partiny"
LABEL email="partiny@163.com"

# 复制自定义Nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制前端静态文件
COPY ./dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]