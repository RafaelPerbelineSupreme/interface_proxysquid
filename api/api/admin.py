from django.contrib import admin
from .models import Grupos, User, Sites
from django.contrib.auth.admin import UserAdmin

admin.site.register(Grupos)
admin.site.register(User)
admin.site.register(Sites)

