from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from .views import UserViewSet, BlockUrl
from api import views

router = routers.DefaultRouter()

router.register('users', UserViewSet)
# router.register('blockurl', BlockUrl)


urlpatterns = [
    path('', include(router.urls)),
    path('removeurl/', views.RemoveUrl.as_view()),
    path('blockurl/', views.BlockUrl.as_view()),
    path('whatismyip/', views.WhatIsMyIp.as_view()),
    path('configuresquid/', views.ConfigureSquid.as_view()),
    path('installsquid/', views.InstallSquid.as_view()),
    path('uninstallsquid/', views.UninstallSquid.as_view())
]

